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
const shipMajorActionsStandard = resolveModule('data/ship-major-actions-standard.json')
const shipMajorActionsCommand = resolveModule('data/ship-major-actions-command.json')
const shipMajorActionsCommunication = resolveModule('data/ship-major-actions-communication.json')
const shipMajorActionsHelm = resolveModule('data/ship-major-actions-helm.json')
const shipMajorActionsNavigator = resolveModule('data/ship-major-actions-navigator.json')
const shipMajorActionsOps = resolveModule('data/ship-major-actions-ops.json')
const shipMajorActionsSensor = resolveModule('data/ship-major-actions-sensor.json')
const shipMajorActionsTactical = resolveModule('data/ship-major-actions-tactical.json')

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
        .setName('ship-major-action')
        .setDescription('Rules lookup for the ship major actions.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('standard')
                .setDescription('Get description of a standard major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The ship standard major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsStandard))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('command')
                .setDescription('Get description of a command major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The command major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsCommand))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('communications')
                .setDescription('Get description of a communications major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The communications major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsCommunication))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('helm')
                .setDescription('Get description of a helm major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The helm major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsHelm))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('navigator')
                .setDescription('Get description of a navigator major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The navigator major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsNavigator))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ops')
                .setDescription('Get description of a operations / engineering major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The operations / engineering major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsOps))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sensor')
                .setDescription('Get description of a sensor major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The sensor major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsSensor))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tactical')
                .setDescription('Get description of a tactical major action.')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('The tactical major action.')
                        .setRequired(true)
                        .addChoices(...createChoices(shipMajorActionsTactical))
                )
        )
        ,
    async execute(interaction) {
        const { options } = interaction;
        const subCmd = options.getSubcommand()
        if (subCmd === 'standard') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Standard', 'action', shipMajorActionsStandard)
        } else if (subCmd === 'command') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Command', 'action', shipMajorActionsCommand)
        } else if (subCmd === 'communication') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Communications', 'action', shipMajorActionsCommunication)
        } else if (subCmd === 'helm') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Helm', 'action', shipMajorActionsHelm)
        } else if (subCmd === 'navigator') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Navigator', 'action', shipMajorActionsNavigator)
        } else if (subCmd === 'ops') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Operations / Engineering', 'action', shipMajorActionsOps)
        } else if (subCmd === 'sensor') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Sensor', 'action', shipMajorActionsSensor)
        } else if (subCmd === 'tactical') {
            await rulesInteraction.handleLookup(interaction, 'Ship Major Actions: Tactical', 'action', shipMajorActionsTactical)
        }
    },
};
