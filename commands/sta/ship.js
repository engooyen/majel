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
const shipActionsChoices1 = []
const shipActionsChoices2 = []
const shipActionsChoices3 = []
for (let action of Object.keys(shipActions).splice(0, 12)) {
    shipActionsChoices1.push({
        name: action,
        value: action
    })
}

for (let action of Object.keys(shipActions).splice(12, 25)) {
    shipActionsChoices2.push({
        name: action,
        value: action
    })
}

for (let action of Object.keys(shipActions).splice(25, 35)) {
    shipActionsChoices3.push({
        name: action,
        value: action
    })
}

const shipMinorActionsChoices = []
for (let action of Object.keys(shipMinorActions)) {
    shipMinorActionsChoices.push({
        name: action,
        value: action
    })
}

const shipAttackProps = []
for (let action of Object.keys(shipAttackProperties)) {
    shipAttackProps.push({
        name: action,
        value: action
    })
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Rules lookup for the ship.')
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
                        .addChoices(...shipMinorActionsChoices)
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
                        .addChoices(...shipAttackProps)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('overview')
                .setDescription('Get an overview of what ship actions belongs to which deparment.')
        ),
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        if (subCmd === 'list') {
            await rulesInteraction.handleShipList(interaction)
        } else if ([
            'actions-page-1',
            'actions-page-2',
            'actions-page-3'].includes(subCmd)) {
            await rulesInteraction.handleShipAction(interaction)
        } else if (subCmd === 'minor-actions') {
            await rulesInteraction.handleShipMinorAction(interaction)
        } else if (subCmd === 'attack-properties') {
            await rulesInteraction.handleShipAttackProperty(interaction)
        } else if (subCmd === 'overview') {
            await rulesInteraction.handleShipOverview(interaction)
        }
    },
};
