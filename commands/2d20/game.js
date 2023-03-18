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

const { SlashCommandBuilder } = require('discord.js');
const diceRollInteraction = resolveModule('interactions/dice-roll')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Set the support game to enable dice rolls specific to that game.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List the supported games.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get help for a specific game. Game must be set first! Use /game set [game]')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set the supported game.')
                .addStringOption(option =>
                    option.setName('game')
                        .setDescription('The game code. /game list to see the game codes.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('custom')
                .setDescription('The custom dice command enabled for this game.')
                .addStringOption(option =>
                    option.setName('cmd')
                        .setDescription('The custom game dice command to run. /game help to see the custom dice commands.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        await diceRollInteraction.handleGame(interaction, subCmd)
    },
};
