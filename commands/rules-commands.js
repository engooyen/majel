/**
 * Copyright 2019-2022 John H. Nguyen
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

 const { SlashCommandBuilder } = require('@discordjs/builders')
 const pcActions = require('../data/pcActions.json')
 const pcMinorActions = require('../data/pcMinorActions.json')
 const pcAttackProperties = require('../data/pcAttackProperties.json')
 const shipActionsOverview = require("../data/shipActionsOverview.json")
 const shipMinorActions = require("../data/shipMinorActions.json")
 const shipAttackProperties = require("../data/shipAttackProperties.json")
 const commands = []

 commands.push(new SlashCommandBuilder()
    .setName('pc')
    .setDescription('Information on pc actions, minor actions, and attack properties.')
    .addSubcommand(subcommand =>
		subcommand
			.setName('actions')
			.setDescription('The actions that can be performed by the PC.')
            .addStringOption(option => {
                const choices = []
                for (let action in pcActions) {
                    choices.push({
                        name: action,
                        value: action
                    })
                }
                option.setName('action')
                    .setDescription('The pc action to perform.')
                    .setRequired(true)
                    .addChoices(...choices)

                return option
            })
    )
    .addSubcommand(subcommand =>
		subcommand
			.setName('minoractions')
			.setDescription('The minor actions the PC can perform.')
            .addStringOption(option => {
                const choices = []
                for (let action in pcMinorActions) {
                    choices.push({
                        name: action,
                        value: action
                    })
                }

                option.setName('action')
                    .setDescription('The pc minor action to perform.')
                    .setRequired(true)
                    .addChoices(...choices)

                return option
            })
    )
    .addSubcommand(subcommand =>
		subcommand
			.setName('attackproperties')
			.setDescription('Attack properties of a PC attack.')
            .addStringOption(option => {
                const choices = []
                for (let action in pcAttackProperties) {
                    choices.push({
                        name: action,
                        value: action
                    })
                }

                option.setName('action')
                    .setDescription('The pc attack property.')
                    .setRequired(true)
                    .addChoices(...choices)

                return option
            })
    )
    .toJSON()
)

const shipCommand = new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Information on ship actions, minor actions, attack properties, station.')

for (let station in shipActionsOverview) {
    const actions = shipActionsOverview[station].split(', ').map(action => action.toUpperCase())
    shipCommand
        .addSubcommand(subcommand =>
            subcommand
                .setName(`${station.toLowerCase().split(' ').join('')}action`)
                .setDescription(`The actions that can be performed at the ${station.toLowerCase()} station.`)
                .addStringOption(option => {
                    const choices = []
                    for (let action of actions) {
                        choices.push({
                            name: action,
                            value: action
                        })
                    }
                    option.setName('action')
                        .setDescription(`The ship action to perfom at  ${station.toLowerCase()} station.`)
                        .setRequired(true)
                        .addChoices(...choices)

                    return option
                })
        )
}

shipCommand
    .addSubcommand(subcommand =>
        subcommand
            .setName('minoractions')
            .setDescription('The minor actions the ship can perform.')
            .addStringOption(option => {
                const choices = []
                for (let action in shipMinorActions) {
                    choices.push({
                        name: action,
                        value: action
                    })
                }

                option.setName('action')
                    .setDescription('The minor ship action to perform.')
                    .setRequired(true)
                    .addChoices(...choices)

                return option
            })
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('attackproperties')
            .setDescription('Attack properties of a ship attack.')
            .addStringOption(option => {
                const choices = []
                for (let action in shipAttackProperties) {
                    choices.push({
                        name: action,
                        value: action
                    })
                }

                option.setName('action')
                    .setDescription('The ship attack property.')
                    .setRequired(true)
                    .addChoices(...choices)

                return option
            })
    )

commands.push(shipCommand.toJSON())

commands.push(new SlashCommandBuilder()
    .setName('momentum')
    .setDescription('Momentum spend table.')
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('determination')
    .setDescription('Determination spend table.')
    .toJSON()
)

 module.exports = commands