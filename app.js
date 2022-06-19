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

require('dotenv').config()
const Discord = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const winston = require('winston')
const utils = require('./utils')
const babble = require('./babble')
const builders = require('./interaction-builder')
const pool = require('./pool')
const trait = require('./trait')
const commands = require('./commands/commands');
const diceRollInteraction = require('./interactions/dice-roll')
const gmInteraction = require('./interactions/gm')
const poolInteraction = require('./interactions/pool')
const playerSheetInteraction = require('./interactions/player-sheet')

// help content
let addMeMsg =
  'https://discordapp.com/api/oauth2/authorize?client_id=538555398521618432&permissions=51200&scope=bot'

//Configure logger settings
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: {
    service: 'user-service',
  },
  transports: [new winston.transports.Console()],
})

// Initialize Discord Bot
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

bot.login(process.env.token)
const rest = new REST({ version: '9' }).setToken(process.env.token);

bot.on('ready', (evt) => {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.user.username + ' - (' + bot.user.id + ')')
  logger.info(evt.guilds.cache)
  bot.guilds.cache.forEach(guild => {
    (async () => {
      try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
          Routes.applicationGuildCommands(bot.user.id, guild.id),
          { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();
  })
})

bot.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isCommand()) {
      const payload = JSON.parse(interaction.customId)
      if (payload.action === 'd20') {
        await gmInteraction.handleResponse(interaction)
      } else if (payload.action === 'm' || payload.action === 't') {
        await poolInteraction.handleResponse(interaction);
      }

      return
    }

    const { commandName, member, options } = interaction;
    if (commandName === 'addme') {
      await interaction.reply({
        content: addMeMsg
      });
    } else if (commandName === 'd6') {
      await diceRollInteraction.handleD6Roll(interaction)
    } else if (commandName === 'babble') {
      await interaction.reply({
        content: `<@${member.user.id}> Technobabble generated. Check your DM.`
      });

      member.user.send(babble.generateTechnobabble());
    } else if (commandName === 'medbabble') {
      await interaction.reply({
        content: `<@${member.user.id}> Technobabble generated. Check your DM.`
      });

      member.user.send(babble.generateMedbabble());
    } else if (commandName === 'alien') {
      await interaction.reply({
        embeds: [builders.generateAlien()]
      });
    } else if (commandName === 'gm') {
      const subCmd = options.getSubcommand()
      if (subCmd === 'promptd20') {
        gmInteraction.buildPrompt(interaction)
      }
    } else if (commandName === 'support') {
      await interaction.reply({
        embeds: [utils.generateSupportCharacter()]
      });
    } else if (commandName === 'playersheet') {
      const subCmd = options.getSubcommand()
      if (subCmd === 'set') {
        await playerSheetInteraction.handleSet(interaction)
      } else if (subCmd === 'get') {
        await playerSheetInteraction.handleGet(interaction)
      }
    } else if (commandName === 'm' || commandName === 't') {
        const subCmd = options.getSubcommand()
        await poolInteraction.buildPrompt(interaction, commandName, subCmd)
    }
  } catch (error) {
    await interaction. reply({
      content: error.toString()
    })
  }
})
