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

require('dotenv').config()
process.setMaxListeners(0)
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const winston = require('winston')
const express = require('express')
const app = express()
const port = process.env.port
const clientId = process.env.client_id

global.resolveModule = (filePath) => {
    const modulePath = path.resolve(__dirname, filePath);
    return require(modulePath);
}

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: {
        service: 'user-service',
    },
    transports: [new winston.transports.Console()],
})

process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
})

global.logger = logger
try {
    // Initialize Discord Bot
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildEmojisAndStickers,
        ]
    })

    client.login(process.env.token)
    client.commands = new Collection()

    const rest = new REST({ version: '10' }).setToken(process.env.token);

    const getCommands = (cmdPath) => {
        const commandsPath = path.join(__dirname, cmdPath);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const commands = [];
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            commands.push(command.data.toJSON());

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`);
            }
        }

        return commands;
    };

    const registerCmds = async (guildId) => {
        try {
            const commands = getCommands('commands')
            const isStaFeature = process.env.feature_sta
            const is2d20Feature = process.env.feature_2d20

            if (isStaFeature) {
                commands.push(...getCommands('commands/sta'))
            }

            if (is2d20Feature) {
                commands.push(...getCommands('commands/2d20'))
            }

            // The put method is used to fully refresh all commands in the guild with the current set
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId), { body: commands },
            );

            // const command = commands.find(cmd => cmd.name === 'computer')

            // await rest.put(
            //     Routes.applicationGuildCommands(clientId, guildId), { body: [] },
            // );
        } catch (error) {
            // console.error(error)
        }
    }

    const refreshCmdForAllServers = async () => {
        client.guilds.cache.forEach(async guild => {
            await registerCmds(guild.id)
        })
    }

    client.on(Events.ClientReady, async () => {
        logger.info('Connected')
        logger.info('Logged in as: ')
        logger.info(client.user.username + ' - (' + client.user.id + ')')
        logger.info('Starting command registration')
        await refreshCmdForAllServers()
        logger.info('Command registration completed')
    })

    client.on(Events.ChannelUpdate, async () => {
        await refreshCmdForAllServers()
    })

    client.on(Events.GuildCreate, async () => {
        await refreshCmdForAllServers()
    })

    client.on(Events.InteractionCreate, async interaction => {
        let command = interaction.client.commands.get(interaction.commandName);
        if (!interaction.isChatInputCommand()) {
            try {
                await interaction.reply({
                    content: `This interaction is no longer supported.`
                });
            } catch (e) {
                console.error(e)
            }
        }

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    })

    client.on(Events.MessageCreate, async msg => {
        if (msg.guildId === process.env.dev_guild_id) {
            if (msg.author.id === process.env.dev_author_id) {
                if (msg.content.includes('refresh')) {
                    await refreshCmdForAllServers()
                }
            }
        }
    })

    app.get('/', (req, res) => {
        res.send(`${process.env.bot_name} is up and running. Testing.`)
    })

    app.listen(port, () => {
        logger.info(`${process.env.bot_name} listening on port ${port}`)
    })

} catch (error) {
    console.error(error)
}
