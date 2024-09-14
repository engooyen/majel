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

const Discord = require('discord.js')
const pcActions = resolveModule('data/pc-actions.json')
const pcMinorActions = resolveModule('data/pc-minor-actions.json')
const pcAttackProperties = resolveModule('data/pc-attack-properties.json')
const shipOverview = resolveModule('data/ship-actions-overview.json')
const shipActions = resolveModule('data/ship-actions.json')
const shipMinorActions = resolveModule('data/ship-minor-actions.json')
const shipAttackProperties = resolveModule('data/ship-attack-properties.json')
const momentum = resolveModule('data/momentum.json')
const determination = resolveModule('data/determination.json')

module.exports = {
    async handlePcList(interaction) {
        const fields = []
        fields.push({
            name: '/pc action [action]',
            value: Object.keys(pcActions).join(', ')
        })
        fields.push({
            name: '/pc minor-action [action]',
            value: Object.keys(pcMinorActions).join(', ')
        })
        fields.push({
            name: '/pc attack-properties [prop]',
            value: Object.keys(pcAttackProperties).join(', ')
        })
        const embed = new Discord.EmbedBuilder()
            .setTitle('PC Rules Lookup Sub-commands')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleShipOverview(interaction) {
        const departments = Object.keys(shipOverview)
        const fields = []
        for (let department of departments) {
            fields.push({
                name: department,
                value: shipOverview[department]
            })
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('Ship Deparments Action Overview')
            .setDescription('/ship action [action] - To look up the rule for that action.')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleShipList(interaction) {
        const fields = []
        fields.push({
            name: '/ship action [action]',
            value: Object.keys(shipActions).join(', ')
        })
        fields.push({
            name: '/ship minor-action [action]',
            value: Object.keys(shipMinorActions).join(', ')
        })
        fields.push({
            name: '/ship attack-properties [prop]',
            value: Object.keys(shipAttackProperties).join(', ')
        })
        fields.push({
            name: '/ship-major-action [station] (New in 2e)',
            value: 'standard, command, communications, helm, navigator, ops, sensor, tactical'
        })
        fields.push({
            name: '/ship-minor-action [station] (New in 2e)',
            value: 'standard, helm, sensor, tactical'
        })
        const embed = new Discord.EmbedBuilder()
            .setTitle('Ship Rules Lookup Sub-commands')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleLookup(interaction, title, option, actions) {
        const action = interaction.options.getString(option)
        const embed = new Discord.EmbedBuilder()
            .setTitle(title)
            .addFields(
                {
                    name: action,
                    value: actions[action],
                }
            )
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleMomentum(interaction) {
        const actions = Object.keys(momentum)
        const fields = []
        for (let action of actions) {
            fields.push({
                name: action,
                value: momentum[action]
            })
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('Momentum Spends')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleDetermination(interaction) {
        const actions = Object.keys(determination)
        const fields = []
        for (let action of actions) {
            fields.push({
                name: action,
                value: determination[action]
            })
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('Determination Spends')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },
}