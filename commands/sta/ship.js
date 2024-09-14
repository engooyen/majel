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
const shipActions = resolveModule('data/ship-actions.json')
const shipMinorActions = resolveModule('data/ship-minor-actions.json')
const shipAttackProperties = resolveModule('data/ship-attack-properties.json')
const shipMajorActionsStandard = resolveModule('data/ship-major-actions-standard.json')

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

const allChoices = createChoices(shipActions)
const shipActionsChoices1 = allChoices.splice(0, 12)
const shipActionsChoices2 = allChoices.splice(12, 25)
const shipActionsChoices3 = allChoices.splice(25, 35)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Rules lookup for the ship minor actions.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List ship rules lookup sub-commands.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions-page-1')
                .setDescription('Get description of an action (page 1).')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship action.')
                        .setRequired(true)
                        .addChoices(...shipActionsChoices1)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions-page-2')
                .setDescription('Get description of an action (page 2).')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship action.')
                        .setRequired(true)
                        .addChoices(...shipActionsChoices2)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions-page-3')
                .setDescription('Get description of an action (page 3).')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship action.')
                        .setRequired(true)
                        .addChoices(...shipActionsChoices3)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('minor-actions')
                .setDescription('Get description of a minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMinorActions))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('attack-properties')
                .setDescription('Get description of a ship attack property.')
                .addStringOption(option =>
                    option.setName('property')
                        .setDescription('The attack property.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipAttackProperties))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('overview')
                .setDescription('Get an overview of what ship actions belongs to which deparment.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('major-actions-standard')
                .setDescription('Get description of a standard major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsStandard))
                )
        )
        ,
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        if (subCmd === 'list') {
            await rulesInteraction.handleShipList(interaction)
        } else if (subCmd === 'overview') {
            await rulesInteraction.handleShipOverview(interaction)
        } else if ([
            'actions-page-1',
            'actions-page-2',
            'actions-page-3'].includes(subCmd)) {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions', 'action', shipActions)
        } else if (subCmd === 'minor-actions') {
            await rulesInteraction.handleLookup(interaction, 'Ship Minor Actions', 'action', shipMinorActions)
        } else if (subCmd === 'attack-properties') {
            await rulesInteraction.handleLookup(interaction, 'Ship Attack Properties', 'property', shipAttackProperties)
        }
    },
};
