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
const pcActions = require('../data/pc-actions.json')
const pcMinorActions = require('../data/pc-minor-actions.json')
const pcAttackProperties = require('../data/pc-attack-properties.json')
const shipOverview = require('../data/ship-actions-overview.json')
const shipActions = require('../data/ship-actions.json')
const shipMinorActions = require('../data/ship-minor-actions.json')
const shipAttackProperties = require('../data/ship-attack-properties.json')
const commands = []
const isStaFeature = process.env.feature_sta
const is2d20Feature = process.env.feature_2d20

commands.push(new SlashCommandBuilder()
    .setName('about')
    .setDescription('Information on development and source code.')
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('help')
    .setDescription('List available commands.')
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('addme')
    .setDescription('Invite me to your game!')
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('d6')
    .setDescription('Roll x challenge dice.')
    .addIntegerOption(option =>
        option.setName('x')
            .setDescription('The number of dice to roll.')
            .setRequired(true)
    )
    .toJSON()
)

commands.push(new SlashCommandBuilder()
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
                { name: '5', value: 5 }
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
    )
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('r')
    .setDescription('Replicating the old !Xd20 command behavior.')
    .addStringOption(option =>
        option
        .setName('params')    
        .setDescription('The parameters are entered in this order: [target] [dice] [difficulty] [crit] [comp].')
        .setRequired(true)
    )
    .toJSON()
)


commands.push(new SlashCommandBuilder()
    .setName('m')
    .setDescription('Manage momentum.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('menu')
        .setDescription('Bring up a menu to incrementally set the value of the momentum pool.')
        .addStringOption(option =>
            option
            .setName('location')    
            .setDescription('Manage the global or current channel\'s momentum pool.')
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
        .setDescription('Directly set the value of the momentum pool.')
        .addStringOption(option =>
            option
            .setName('location')    
            .setDescription('Manage the global or current channel\'s momentum pool.')
            .setRequired(true)
            .addChoices(
                { name: 'global', value: 'global' },
                { name: 'here', value: 'here' }
            )
        )
        .addIntegerOption(option =>
            option
            .setName('amount')    
            .setDescription('The pool\s new amount.')
            .setRequired(true)
        )
    )
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('t')
    .setDescription('Manage threat.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('menu')
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
            .setDescription('The pool\s new amount.')
            .setRequired(true)
        )
    )
    .toJSON()
)

commands.push(new SlashCommandBuilder()
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
    )
    .toJSON()
)

// STA specific features
if (isStaFeature) {
    const pcActionsOptions = []
    for (let action of Object.keys(pcActions)) {
        pcActionsOptions.push({
            name: action,
            value: action
        })
    }

    const pcMinorActionsOptions = []
    for (let action of Object.keys(pcMinorActions)) {
        pcMinorActionsOptions.push({
            name: action,
            value: action
        })
    }

    const pcAttackProps = []
    for (let action of Object.keys(pcAttackProperties)) {
        pcAttackProps.push({
            name: action,
            value: action
        })
    }
    commands.push(new SlashCommandBuilder()
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
                    .addChoices(...pcActionsOptions)
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
                    .addChoices(...pcMinorActionsOptions)
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
                    .addChoices(...pcAttackProps)
            )
        )
        .toJSON()
    )
    
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

    commands.push(new SlashCommandBuilder()
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
        )
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('momentum')
        .setDescription('Display the momentum spends table.')
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('determination')
        .setDescription('Display the determination spends table.')
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('babble')
        .setDescription('Generate a random techno babble phrase and DMs the user.')
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('medbabble')
        .setDescription('Generate a random medical babble phrase and DMs the user.')
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('support')
        .setDescription('Generate a random support character. Use `!support help` for more details.')
        .toJSON()
    )

    commands.push(new SlashCommandBuilder()
        .setName('alien')
        .setDescription('Generate a random alien species.')
        .toJSON()
    )
}

if (is2d20Feature) {
    commands.push(new SlashCommandBuilder()
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
        )
        .toJSON()
    )
}

// commands.push(new SlashCommandBuilder()
//     .setName('gm')
//     .setDescription('Some GM commands to present to a channel')
//     .addSubcommand(subcommand =>
//         subcommand
//             .setName('promptd20')
//             .setDescription('Prompt user for a d20 roll.')
//             .addUserOption(option =>
//                 option.setName('player')
//                     .setDescription('Choose player to perform the roll.')
//                     .setRequired(true)
//             )
//             .addStringOption(option =>
//                 option.setName('attribute')
//                     .setDescription('Default attribute for this action.')
//                     .setRequired(true)
//                     .addChoices(
//                         { name: 'Control', value: 'control' },
//                         { name: 'Fitness', value: 'fitness' },
//                         { name: 'Presence', value: 'presence' },
//                         { name: 'Daring', value: 'daring' },
//                         { name: 'Insight', value: 'insight' },
//                         { name: 'Reason', value: 'reason' }
//                     )
//             )
//             .addStringOption(option =>
//                 option.setName('discipline')
//                     .setDescription('Default discipline for this action.')
//                     .setRequired(true)
//                     .addChoices(
//                         { name: 'Command', value: 'command' },
//                         { name: 'Security', value: 'security' },
//                         { name: 'Science', value: 'science' },
//                         { name: 'Conn', value: 'conn' },
//                         { name: 'Engineering', value: 'engineering' },
//                         { name: 'Medicine', value: 'medicine' }
//                     )
//             )
//             .addIntegerOption(option =>
//                 option.setName('difficulty')
//                     .setDescription('Difficulty of this action.')
//                     .setRequired(true)
//                     .addChoices(
//                         { name: '1', value: 1 },
//                         { name: '2', value: 2 },
//                         { name: '3', value: 3 },
//                         { name: '4', value: 4 },
//                         { name: '5', value: 5 }
//                     )
//             )
//             .addIntegerOption(option =>
//                 option.setName('crit')
//                     .setDescription('Critical range.')
//                     .setRequired(true)
//                     .addChoices(
//                         { name: '1', value: 1 },
//                         { name: '2', value: 2 },
//                         { name: '3', value: 3 },
//                         { name: '4', value: 4 },
//                         { name: '5', value: 5 }
//                     )
//             )
//             .addIntegerOption(option =>
//                 option.setName('comp')
//                     .setDescription('Complication range.')
//                     .setRequired(true)
//                     .addChoices(
//                         { name: '20', value: 10 },
//                         { name: '19', value: 19 },
//                         { name: '18', value: 18 },
//                         { name: '17', value: 17 },
//                         { name: '16', value: 16 },
//                         { name: '15', value: 15 },
//                         { name: '14', value: 14 }
//                     )
//             )
//     )
//     .toJSON()
// )

// commands.push(new SlashCommandBuilder()
//     .setName('playersheet')
//     .setDescription('Committing a player sheet')
//     .addSubcommand(subcommand =>
//         subcommand
//         .setName('set')
//         .setDescription('Set a player sheet.')
//         .addAttachmentOption(option =>
//             option.setName('sheet')
//                 .setDescription('Player sheet to upload.')
//                 .setRequired(true)
//         )
//     )
//     .addSubcommand(subcommand =>
//         subcommand
//         .setName('get')
//         .setDescription('Get a player sheet.')
//     )
//     .toJSON()
// )

module.exports = commands
