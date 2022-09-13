/**
 * Copyright 2019-2022 John H. Nguyen
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const Discord = require('discord.js')
const pcActions = require('../data/pc-actions.json')
const pcMinorActions = require('../data/pc-minor-actions.json')
const pcAttackProperties = require('../data/pc-attack-properties.json')
const shipOverview = require('../data/ship-actions-overview.json')
const shipActions = require('../data/ship-actions.json')
const shipMinorActions = require('../data/ship-minor-actions.json')
const shipAttackProperties = require('../data/ship-attack-properties.json')
const momentum = require('../data/momentum.json')
const determination = require('../data/determination.json')

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
        const embed = new Discord.MessageEmbed()
            .setTitle('PC Rules Lookup Sub-commands')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handlePcAction(interaction) {
        const action = interaction.options.getString('action')
        const embed = new Discord.MessageEmbed()
            .setTitle('PC Action')
            .addFields(
                {
                    name: action,
                    value: pcActions[action],
                }
            )
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handlePcMinorAction(interaction) {
        const action = interaction.options.getString('action')
        const embed = new Discord.MessageEmbed()
            .setTitle('PC Minor Action')
            .addFields(
                {
                    name: action,
                    value: pcMinorActions[action],
                }
            )
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

        const embed = new Discord.MessageEmbed()
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
        const embed = new Discord.MessageEmbed()
            .setTitle('Ship Rules Lookup Sub-commands')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleShipAction(interaction) {
        const action = interaction.options.getString('action')
        const embed = new Discord.MessageEmbed()
            .setTitle('Ship Action')
            .addFields(
                {
                    name: action,
                    value: shipActions[action],
                }
            )
        await interaction.reply({
            embeds: [embed]
        })
    },

    async handleShipMinorAction(interaction) {
        const action = interaction.options.getString('action')
        const embed = new Discord.MessageEmbed()
            .setTitle('Ship Minor Action')
            .addFields(
                {
                    name: action,
                    value: shipMinorActions[action],
                }
            )
        await interaction.reply({
            embeds: [embed]
        })
    },


    async handleShipAttackProperty(interaction) {
        const prop = interaction.options.getString('property')
        const embed = new Discord.MessageEmbed()
            .setTitle('Ship Attack Property')
            .addFields(
                {
                    name: prop,
                    value: shipAttackProperties[prop],
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

        const embed = new Discord.MessageEmbed()
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

        const embed = new Discord.MessageEmbed()
            .setTitle('Determination Spends')
            .addFields(...fields)
        await interaction.reply({
            embeds: [embed]
        })
    },
}