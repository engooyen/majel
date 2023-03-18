/**
 * Copyright 2019-2023 John H. Nguyen
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

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const pool = resolveModule('api/pool')
const { GameConfig } = resolveModule('api/game-config')

const poolFunctions = {
    m: pool.adjustMomentum,
    t: pool.adjustThreat
}

module.exports = {
    async buildPrompt(interaction, loc, op, gameConfig) {
        let cmd = interaction.commandName
        if (!interaction.isChatInputCommand()) {
            try {
                const payload = JSON.parse(interaction.customId)
                cmd = interaction.client.commands.get(payload.action);
            } catch (e) {
                console.error(e)
            }
        }
        const { options, guild, channel } = interaction
        const subCmd = options?.getSubcommand() || op
        const location = options?.getString('location') || loc
        const amount = options?.getInteger('amount')
        const pool = options?.getString('pool')
        const action = cmd === 'p'
            ? pool === 'player' ? 'm' : 't'
            : cmd
        // const lastMsg = new LastMessage(guild, channel, action)

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(JSON.stringify({
                        action,
                        context: {
                            channel: location === 'here' ? channel.name : 'global',
                            op: 'add',
                            value: 1
                        }
                    }))
                    .setLabel('Add')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(JSON.stringify({
                        action,
                        context: {
                            channel: location === 'here' ? channel.name : 'global',
                            op: 'sub',
                            value: 1
                        }
                    }))
                    .setLabel('Spend')
                    .setStyle(ButtonStyle.Primary)
            )

        // await lastMsg.delete(interaction)
        if (!gameConfig) {
            gameConfig = new GameConfig(interaction.guild)
        }
        let embed
        await interaction.deferReply()
        if (subCmd === 'set') {
            embed = await poolFunctions[action](guild, channel, 'set', amount, location === 'here', await gameConfig.getGame())
        } else {
            embed = await poolFunctions[action](guild, channel, 'add', 0, location === 'here', await gameConfig.getGame())
        }

        await interaction.editReply({
            embeds: [embed],
            // components: [row]
        })

        // await lastMsg.save(interaction)
    },
    async handleResponse(interaction) {
        const payload = JSON.parse(interaction.customId)
        const cmd = payload.action
        const op = payload.context.op
        const amount = payload.context.value
        const isChannelPool = payload.context.channel !== 'global'

        const gameConfig = new GameConfig(interaction.guild)
        await poolFunctions[cmd](interaction.guild, interaction.channel, op, amount, isChannelPool, await gameConfig.getGame())
        await this.buildPrompt(interaction, isChannelPool ? 'here' : 'global', op, gameConfig)
    }
}
