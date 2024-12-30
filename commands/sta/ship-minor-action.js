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

const { SlashCommandBuilder } = require('discord.js');
const rulesInteraction = resolveModule('interactions/rules')
const shipMinorActionsStandard = resolveModule('data/ship-minor-actions-standard.json')
const shipMinorActionsHelm = resolveModule('data/ship-minor-actions-helm.json')
const shipMinorActionsSensor = resolveModule('data/ship-minor-actions-sensor.json')
const shipMinorActionsTactical = resolveModule('data/ship-minor-actions-tactical.json')

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
        .setName('ship-minor-action')
        .setDescription('Rules lookup for the ship minor actions.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('standard')
                .setDescription('Get description of a standard minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship standard minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMinorActionsStandard))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('helm')
                .setDescription('Get description of a helm minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The helm minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMinorActionsHelm))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sensor')
                .setDescription('Get description of a sensor operations minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The sensor operations minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMinorActionsSensor))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tactical')
                .setDescription('Get description of a tactical minor action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The tactical minor action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMinorActionsTactical))
                )
        )
        ,
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        if (subCmd === 'standard') {
            await rulesInteraction.handleLookup(interaction, 'Ship Minor Actions: Standard', 'action', shipMinorActionsStandard)
        } else if (subCmd === 'helm') {
            await rulesInteraction.handleLookup(interaction, 'Ship Minor Actions: Helm', 'action', shipMinorActionsHelm)
        } else if (subCmd === 'sensor') {
            await rulesInteraction.handleLookup(interaction, 'Ship Minor Actions: Sensor Operations', 'action', shipMinorActionsSensor)
        } else if (subCmd === 'tactical') {
            await rulesInteraction.handleLookup(interaction, 'Ship Minor Actions: Tactical', 'action', shipMinorActionsTactical)
        }
    },
};
