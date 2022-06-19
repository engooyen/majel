/**
 * Copyright 2019-2022 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const Discord = require('discord.js')
const pool = require('../pool')
const { LastMessage } = require('../last-message')

const poolFunctions = {
    m: pool.adjustMomentum,
    t: pool.adjustThreat
}

module.exports = {
    async buildPrompt(interaction, cmd, subCmd) {
        const guild = interaction.guild
        const channel = interaction.channel
        const action = cmd
        const lastMsg = new LastMessage(guild, channel, action)

        let row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(JSON.stringify({
                        action,
                        context: {
                            channel: subCmd === 'here' ? channel.name : 'global',
                            op: 'add',
                            value: 1
                        }
                    }))
                    .setLabel('Add')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId(JSON.stringify({
                        action,
                        context: {
                            channel: subCmd === 'here' ? channel.name : 'global',
                            op: 'sub',
                            value: 1
                        }
                    }))
                    .setLabel('Spend')
                    .setStyle('PRIMARY')
            )

        await lastMsg.delete(interaction)

        const embed = await poolFunctions[cmd](guild, channel, 'add', 0, subCmd === 'here')
        await interaction.reply({
            embeds: [embed],
            components: [row]
        })

        await lastMsg.save(interaction)
    },
    async handleResponse(interaction) {
        const payload = JSON.parse(interaction.customId)
        const cmd = payload.action
        const op = payload.context.op
        const amount = payload.context.value
        const isChannelPool = payload.context.channel !== 'global'

        await poolFunctions[cmd](interaction.guild, interaction.channel, op, amount, isChannelPool)
        await this.buildPrompt(interaction, cmd, isChannelPool ? 'here' : 'global')
    }
}
