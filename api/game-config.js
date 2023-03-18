const { EmbedBuilder } = require('discord.js')
const { redis } = resolveModule('api/redis')
const config = resolveModule('config')
const utils = resolveModule('api/utils')
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
        const embed = new EmbedBuilder()
            .setTitle(`Setting Game to ${game}`)
        const guildData = await redis.getGuildData(this.guildId)
        if (!config[game]) {
            embed.addFields({ name: 'Error', value: `'${game}' not supported!` })
            embed.addFields(...this.supportedGames().fields)
        } else {
            guildData.game = game;
            await redis.setGuildData(this.guildId, guildData)
            embed.addFields({ name: 'Success', value: `Game is now set to ${config[game].display}` })
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
        const embed = new EmbedBuilder()
            .setTitle('Supported Games')
            .setDescription('Supported game listed by their code and full name.')
        const keys = Object.keys(config)
        for (let key of keys) {
            embed.addFields({ name: key, value: config[key].display })
        }

        return embed
    }

    async supportedCustomCmds() {
        const embed = new EmbedBuilder()
            .setTitle('Supported Commands')

        const guildData = await redis.getGuildData(this.guildId)
        const game = guildData?.game
        if (game) {
            embed.setDescription(`Supported commands for ${config[game].display}`)
            const diceCmds = config[game].dice;
            const keys = Object.keys(diceCmds)
            for (let key of keys) {
                embed.addFields({ name: key, value: diceCmds[key].display })
            }

            if (keys.length === 0) {
                embed.addFields({ name: 'Error', value: `No custom commands avaialble for ${config[game].display}` })
            }
        } else {
            embed.addFields({ name: 'Error', value: `Game has not been set. Use /game set [game] to set. /game list to see the list of supported games.` })
        }

        return embed
    }

    async runCustomCmd(customCmd) {
        const guildData = await redis.getGuildData(this.guildId)
        const game = guildData?.game
        const gameConfig = config[game]
        const embed = new EmbedBuilder()
            .setTitle(this.player)

        if (game) {
            const cmd = gameConfig.dice[customCmd]
            if (!cmd) {
                embed.addFields({
                    name: `${customCmd} is not a game specific command`,
                    value: `Valid commands:`
                })
                const cmds = await this.supportedCustomCmds()
                embed.addFields(...cmds.fields)
            } else {
                embed.setThumbnail(gameConfig.images.d20)
                embed.addFields({
                    name: cmd.display,
                    value: utils.randomElement(cmd.values)
                })
            }
        } else {
            embed.addFields({
                name: 'Error',
                value: `Game has not been set. Use /game set [game] to set. /game list to see the list of supported games.`
            })
        }

        return embed
    }
}

module.exports = {
    GameConfig
}
