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
const commands = []
const isStaFeature = process.env.feature_sta
const is2d20Feature = process.env.feature_2d20

commands.push(new SlashCommandBuilder()
    .setName('about')
    .setDescription('Information on development and source code.')
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
    .setName('m')
    .setDescription('Manage momentum.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('global')
        .setDescription('Manage global momentum pool.')
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('here')
        .setDescription('Manage momentum pool for this channel only.')
    )
    .toJSON()
)

commands.push(new SlashCommandBuilder()
    .setName('t')
    .setDescription('Manage threat.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('global')
        .setDescription('Manage global threat pool.')
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('here')
        .setDescription('Manage threat pool for this channel only.')
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
                .setRequired(true)
        )
    )
    .toJSON()
)

// STA specific features
if (isStaFeature) {
    commands.push(new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Bring up a rules lookup menu.')
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
