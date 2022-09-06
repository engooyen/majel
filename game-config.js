const Discord = require('discord.js')
const { redis } = require('./redis')
const config = require('./config')
const utils = require('./utils')
const isStaFeature = process.env.feature_sta

class GameConfig {
    constructor(guild, player) {
        this.guildId = guild.id
        this.player = player
    }

    async getHelp() {
        const guildData = await redis.getGuildData(this.guildId)
        if (guildData.game) {
            return this.supportedCustomCmds() || `No custom commands avaialble for ${config[guildData.game].display}`
        }
    }

    async setGame(game) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Setting Game to ${game}`)
        const guildData = await redis.getGuildData(this.guildId)
        if (!config[game]) {
            embed.addField('Error', `'${game}' not supported!`)
            embed.addFields(...this.supportedGames().fields)
        } else {
            guildData.game = game;
            await redis.setGuildData(this.guildId, guildData)
            embed.addField('Success', `Game is now set to ${config[game].display}`)
        }

        return embed
    }

    async getGame() {
        if (isStaFeature) {
            return config.sta
        }

        const guildData = await redis.getGuildData(this.guildId)
        const game = guildData?.game
        return config[game]
    }

    supportedGames() {
        const embed = new Discord.MessageEmbed()
            .setTitle('Supported Games')
            .setDescription('Supported game listed by their code and full name.')
        const keys = Object.keys(config)
        for (let key of keys) {
            embed.addField(key, config[key].display)
        }

        return embed
    }

    async supportedCustomCmds() {
        const embed = new Discord.MessageEmbed()
            .setTitle('Supported Commands')

        const guildData = await redis.getGuildData(this.guildId)
        const game = guildData?.game
        if (game) {
            embed.setDescription(`Supported commands for ${config[game].display}`)
            const diceCmds = config[game].dice;
            const keys = Object.keys(diceCmds)
            for (let key of keys) {
                embed.addField(key, diceCmds[key].display)
            }

            if (keys.length === 0) {
                embed.addField('Error', `No custom commands avaialble for ${config[game].display}`)
            }
        } else {
            embed.addField('Error', `Game has not been set. Use /game set [game] to set. /game list to see the list of supported games.`)
        }

        return embed
    }

    async runCustomCmd(customCmd) {
        const guildData = await redis.getGuildData(this.guildId)
        const game = guildData?.game
        const gameConfig = config[game]
        const embed = new Discord.MessageEmbed()
            .setTitle(this.player)

        if (game) {
            const cmd = gameConfig.dice[customCmd]
            if (!cmd) {
                embed.addField(`${customCmd} is not a game specific command`, `Valid commands:`)
                const cmds = await this.supportedCustomCmds()
                embed.addFields(...cmds.fields)
            } else {
                embed.setThumbnail(gameConfig.images.d20)
                embed.addField(cmd.display, utils.randomElement(cmd.values))
            }
        } else {
            embed.addField('Error', `Game has not been set. Use /game set [game] to set. /game list to see the list of supported games.`)
        }

        return embed
    }
}

module.exports = {
    GameConfig
}
