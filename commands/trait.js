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
const traitInteraction = resolveModule('interactions/trait');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trait')
        .setDescription('Manage traits.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Get containers and their traits or list traits for a specific container.')
                .addStringOption(option =>
                    option.setName('container')
                        .setDescription('List all traits for this container.')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set a value to a trait within a container.')
                .addStringOption(option =>
                    option.setName('container')
                        .setDescription('The container to modify.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('trait')
                        .setDescription('The trait to modify.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('value')
                        .setDescription('The value of the trait to set.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('del')
                .setDescription('Delete a trait from a container.')
                .addStringOption(option =>
                    option.setName('container')
                        .setDescription('The container to modify.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('trait')
                        .setDescription('The trait to modify.')
                )
        ),
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        await traitInteraction.buildPrompt(interaction, subCmd)
    },
};
