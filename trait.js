/**
 * Copyright 2019-2021 John H. Nguyen
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

const { redis } = require("./redis")

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
        embed.fields.push({
            name: "No traits Found",
            value: "Use !trait set [container name] [trait name] [trait value] to set a trait.",
        })
    } else {
        for (let trait of traits) {
            embed.fields.push({
                name: trait,
                value: container[trait],
                inline: true
            })
        }
    }
}

module.exports = {
    async trait(msg, option) {
        const guildId = msg.guild.id.toString()
        console.warn(msg.author.username)
        console.warn("guild id", guildId)
        console.warn("options", option)

        let guildData = await redis.get(guildId)
        if (guildData) {
            guildData = JSON.parse(guildData)
        }

        console.warn("get redis", guildId, guildData)
        if (!guildData) {
            guildData = {}
        }

        if (!guildData.traits) {
            guildData.traits = {}
        }

        const embed = {
            title: "Traits",
            color: 15158332,
            fields: [],
        }

        if (option) {
            const options = option.toLowerCase().split(" ");
            console.warn(options)
            if (options.length > 0) {
                let arg = options.shift()
                if (arg === "set") {
                    let containerName = options.shift()
                    let key = options.shift()
                    let value = options.shift()
                    console.warn(containerName, key, value)
                    if (containerName && key && value) {
                        if (!guildData.traits[containerName]) {
                            guildData.traits[containerName] = {}
                        }

                        guildData.traits[containerName][key] = value
                        embed.title += " for " + containerName
                        dumpTraits(guildData.traits[containerName], embed)
                    } else {
                        embed.fields.push({
                            name: "Error",
                            value: "!trait set requires arguments: [container name] [trait name] [trait value]",
                        })
                    }
                } else if (arg === "del") {
                    let containerName = options.shift()
                    let key = options.shift()
                    if (containerName && key) {
                        delete guildData.traits[containerName][key]
                        dumpTraits(guildData.traits[containerName], embed)
                    } else if (containerName) {
                        delete guildData.traits[containerName]
                        embed.fields.push({
                            name: "Success",
                            value: `${containerName} deleted`,
                        })
                    } else {
                        embed.fields.push({
                            name: "Error",
                            value: "!trait del requires arguments: [container name] [trait name (optional)]",
                        })
                    }
                } else {
                    if (!guildData.traits[arg]) {
                        embed.fields.push({
                            name: "Error",
                            value: `Container '${arg}' not found`,
                        })
                    } else {
                        embed.title += " for " + arg
                        dumpTraits(guildData.traits[arg], embed)
                    }
                }
            }
        } else {
            const containers = Object.keys(guildData.traits);
            console.warn(containers)
            if (containers.length === 0) {
                embed.fields.push({
                    name: "No traits Found",
                    value: "Use !trait set [container name] [trait name] [trait value] to set a trait.",
                })
            } else {
                embed.title = "All Traits"
                for (let container of containers) {
                    embed.fields.push({
                        name: "Traits for:",
                        value: container
                    })
                    dumpTraits(guildData.traits[container], embed)
                }
            }
        }

        console.warn("Guild data:", guildData)

        await redis.set(guildId, JSON.stringify(guildData))
        return embed
    }
}
