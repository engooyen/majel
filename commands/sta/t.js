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
const poolInteraction = resolveModule('interactions/pool')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('t')
    .setDescription('Manage threat.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('get')
            .setDescription('Bring up a menu to incrementally set the value of the threat pool.')
            .addStringOption(option =>
                option
                    .setName('location')
                    .setDescription('Manage the global or current channel\'s threat pool.')
                    .setRequired(true)
                    .addChoices(
                        { name: 'global', value: 'global' },
                        { name: 'here', value: 'here' }
                    )
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Directly set the value of the threat pool.')
            .addStringOption(option =>
                option
                    .setName('location')
                    .setDescription('Manage the global or current channel\'s threat pool.')
                    .setRequired(true)
                    .addChoices(
                        { name: 'global', value: 'global' },
                        { name: 'here', value: 'here' }
                    )
            )
            .addIntegerOption(option =>
                option
                    .setName('amount')
                    .setDescription('The pool\'s new amount.')
                    .setRequired(true)
            )
    ),
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) {
            await poolInteraction.handleResponse(interaction);
        } else {
            const { commandName } = interaction;
            await poolInteraction.buildPrompt(interaction, commandName)
        }
    },
};
