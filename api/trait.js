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

const { EmbedBuilder } = require('discord.js')
const { redis } = resolveModule('api/redis')

// It's a key-value store within a container. Keys are traits for the end user.
// trait structure:
//
// guildData = {
//     traits: {
//         container: {
//             key: value,
//             ...
//         },
//         ...
//     }
// }

// dump all traits with in a container.
function dumpTraits(container, embed) {
    const traits = Object.keys(container)
    if (traits.length === 0) {
        embed.addFields({
            name: 'No traits Found',
            value: 'Use /trait set [container name] [trait name] [trait value] to set a trait.',
        })
    } else {
        for (let trait of traits) {
            embed.addFields({
                name: trait,
                value: container[trait],
                inline: true
            })
        }
    }
}

module.exports = {
    async doTrait(guildId, subCmd, container, trait, value) {
        let guildData = await redis.get(guildId)
        if (guildData) {
            guildData = JSON.parse(guildData)
        }

        // console.warn('get redis', guildId, guildData)
        if (!guildData) {
            guildData = {}
        }

        if (!guildData.traits) {
            guildData.traits = {}
        }

        const embed = new EmbedBuilder()
            .setTitle('Traits')
            .setColor(15158332)


        if (container) {
            if (subCmd === 'set') {
                if (container && trait && value) {
                    if (!guildData.traits[container]) {
                        guildData.traits[container] = {}
                    }

                    guildData.traits[container][trait] = value
                    embed.title += ' for ' + container
                    dumpTraits(guildData.traits[container], embed)
                } else {
                    embed.addFields({ name: 'Error', value: 'trait set requires arguments: [container name] [trait name] [trait value]' })
                }
            } else if (subCmd === 'del') {
                if (container && trait) {
                    delete guildData.traits[container][trait]
                    dumpTraits(guildData.traits[container], embed)
                } else if (container) {
                    delete guildData.traits[container]
                    embed.addFields({ name: 'Success', value: `${container} deleted` })
                } else {
                    embed.addFields({ name: 'Error', value: '/trait del requires arguments: [container name] [trait name (optional)]' })
                }
            } else {
                if (!guildData.traits[container]) {
                    embed.addFields({ name: 'Error', value: `Container '${container}' not found` })
                } else {
                    embed.title += ' for ' + container
                    dumpTraits(guildData.traits[container], embed)
                }
            }
        } else {
            const containers = Object.keys(guildData.traits);
            // console.warn(containers)
            if (containers.length === 0) {
                embed.addFields({ name: 'No traits Found', value: 'Use /trait set [container name] [trait name] [trait value] to set a trait.'})
            } else {
                embed.title = 'All Traits'
                for (let container of containers) {
                    embed.addFields({ name: 'Traits for:', value: container })
                    dumpTraits(guildData.traits[container], embed)
                }
            }
        }

        // console.warn('Guild data:', guildData)

        await redis.set(guildId, JSON.stringify(guildData))
        return embed
    }
}
