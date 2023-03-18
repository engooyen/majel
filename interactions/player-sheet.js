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

const Discord = require('discord.js')
const axios = require('axios').default;
const { playerSheetSet, playerSheetGet } = resolveModule('player-sheets')

module.exports = {
    async handleSet(interaction) {
        const playerSheet = interaction.options.getAttachment('sheet')
        let response = await axios.get(playerSheet.attachment)
        let sheet = response.data
        await playerSheetSet(guildId, playerId, sheet)
        await interaction.reply({
            content: 'Player sheet uploaded.'
        })
    },
    async handleGet(interaction) {
        const guildId = interaction.guildId
        const playerId = interaction.member.user.id
        const sheet = await playerSheetGet(guildId, playerId)
        if (!sheet) {
            interaction.reply('Player sheet not found!')
            return
        }
        const attributes = sheet.attributes
        const disciplines = sheet.disciplines
        const embed = new Discord.EmbedBuilder()
            .setTitle('Player Sheet')
            .addFields(
                {
                    name: 'Attributes',
                    value: 'Attributes',
                },
                {
                    name: 'Control',
                    value: attributes.control.toString(),
                    inline: true,
                },
                {
                    name: 'Fitness',
                    value: attributes.fitness.toString(),
                    inline: true,
                },
                {
                    name: 'Presence',
                    value: attributes.presence.toString(),
                    inline: true,
                },
                {
                    name: 'Daring',
                    value: attributes.daring.toString(),
                    inline: true,
                },
                {
                    name: 'Insight',
                    value: attributes.insight.toString(),
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: attributes.reason.toString(),
                    inline: true,
                },
                {
                    name: 'Disciplines',
                    value: 'Disciplines',
                },
                {
                    name: 'Command',
                    value: disciplines.command.toString(),
                    inline: true,
                },
                {
                    name: 'Security',
                    value: disciplines.security.toString(),
                    inline: true,
                },
                {
                    name: 'Science',
                    value: disciplines.science.toString(),
                    inline: true,
                },
                {
                    name: 'Conn',
                    value: disciplines.conn.toString(),
                    inline: true,
                },
                {
                    name: 'Engineering',
                    value: disciplines.engineering.toString(),
                    inline: true,
                },
                {
                    name: 'Medicine',
                    value: disciplines.medicine.toString(),
                    inline: true,
                }
            )

        await interaction.reply({
            embeds: [embed]
        })
    }
}