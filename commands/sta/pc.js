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
const rulesInteraction = resolveModule('interactions/rules')
const pcActions = resolveModule('data/pc-actions.json')
const pcMinorActions = resolveModule('data/pc-minor-actions.json')
const pcAttackProperties = resolveModule('data/pc-attack-properties.json')

function createChoices(actions) {
    let choices = []
    for (let action of Object.keys(actions)) {
        choices.push({
            name: action,
            value: action
        })
    }

    return choices
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pc')
        .setDescription('Rules lookup for the pc.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List PC rules lookup sub-commands.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions')
                .setDescription('Get description of an action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The pc action.')
                        .setRequired(true)
                        .addChoices(...createChoices(pcActions))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('minor-actions')
                .setDescription('Get description of a minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The pc minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(pcMinorActions))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('attack-properties')
                .setDescription('Get description of a pc attack property.')
                .addStringOption(option =>
                    option.setName('property')
                        .setDescription('The pc attack property.')
                        .setRequired(true)
                        .addChoices(...createChoices(pcAttackProperties))
                )
        ),
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        if (subCmd === 'list') {
          await rulesInteraction.handlePcList(interaction)
        } else if (subCmd === 'actions') {
          await rulesInteraction.handleLookup(interaction, 'PC Action', 'action', pcActions)
        } else if (subCmd === 'minor-actions') {
          await rulesInteraction.handlePcMinorAction(interaction, 'PC Minor Action', 'action', pcMinorActions)
        } else if (subCmd === 'attack-properties') {
          await rulesInteraction.handlePcAttackProperty(interaction, 'PC Attack Property', 'property', pcAttackProperties)
        }
    },
};
