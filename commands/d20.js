/**
 * Copyright 2019-2025 John H. Nguyen
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

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { rollD20 } = resolveModule('api/interaction-builder')
const { GameConfig } = resolveModule('api/game-config')
const is2d20Feature = process.env.feature_2d20

module.exports = {
    data: new SlashCommandBuilder()
        .setName('d20')
        .setDescription('Roll d20')
        .addIntegerOption(option =>
            option.setName('target')
                .setDescription('Set the target range for the roll.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('difficulty')
                .setDescription('Difficulty of this action (Default 0).')
                .addChoices(
                    { name: '0', value: 0 },
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 }
                )
        )
        .addIntegerOption(option =>
            option.setName('crit')
                .setDescription('Critical range (Default 1).')
                .addChoices(
                    { name: '1', value: 1, default: true },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 },
                    { name: '6', value: 6 },
                    { name: '7', value: 7 },
                    { name: '8', value: 8 },
                    { name: '9', value: 9 },
                    { name: '10', value: 10 }
                )
        )
        .addIntegerOption(option =>
            option.setName('comp')
                .setDescription('Complication range (Default 20).')
                .addChoices(
                    { name: '20', value: 20, default: true },
                    { name: '19', value: 19 },
                    { name: '18', value: 18 },
                    { name: '17', value: 17 },
                    { name: '16', value: 16 },
                    { name: '15', value: 15 },
                    { name: '14', value: 14 }
                )
        )
        .addIntegerOption(option =>
            option.setName('dice')
                .setDescription('Number of dice to roll (Default 2).')
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2, default: true },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 }
                )
        ),
    async execute(interaction) {
        const target = interaction.options.getInteger('target')
        const difficulty = interaction.options.getInteger('difficulty') || 0
        const crit = interaction.options.getInteger('crit') || 1
        const comp = interaction.options.getInteger('comp') || 20
        const dice = interaction.options.getInteger('dice') || 2
        const gameConfig = new GameConfig(interaction.guild)
        const game = await gameConfig.getGame()

        if (is2d20Feature && !game) {
            const warning = new EmbedBuilder()
                .setTitle('Game not set!')
                .setDescription('/game set [game] to set game and /game list to show supported games.')

            await interaction.reply({
                embeds: [warning]
            })

            return
        }

        const result = rollD20(dice, [target, crit, comp, difficulty], interaction, game)
        await interaction.reply({
            embeds: [result],
        })
    },
};
