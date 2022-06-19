/**
 * Copyright 2019-2022 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const { redis } = require("./redis")

class LastMessage {
    constructor(guild, channel, action) {
        this.guildId = guild.id
        this.channelId = channel.id
        this.action = action
    }

    async lastMsg() {
        let guildData = await redis.getJson(this.guildId)
        const channelData = guildData[this.channelId] || {}
        const interactions = channelData.interactions || {}

        return interactions[this.action]
    }

    async save(interaction) {
        const reply = await interaction.fetchReply()
        let guildData = await redis.getJson(this.guildId)
        const channelData = guildData[this.channelId] || {}
        const interactions = channelData.interactions || {}
        interactions[this.action] = reply.id
        channelData.interactions = interactions
        await redis.set(this.guildId, JSON.stringify(guildData))
    }

    async delete(interaction) {
        try {
            const lastMsg = await this.lastMsg()
            if (lastMsg) {
                const channel = interaction.channel
                const msgs = await channel.messages.fetch()
                const msg = msgs.find(m => {
                    return m.id === lastMsg
                })
                await msg.delete()
            }
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = LastMessage
