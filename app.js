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
process.setMaxListeners(0)
const Discord = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const winston = require('winston')
const utils = require('./utils')
const babble = require('./babble')
const builders = require('./interaction-builder')
const commands = require('./commands/commands');
const diceRollInteraction = require('./interactions/dice-roll')
const traitInteraction = require('./interactions/trait')
const poolInteraction = require('./interactions/pool')
const rulesInteraction = require('./interactions/rules')
const about = require('./data/about.json')[0]
const help = require('./data/help.json')
const express = require('express')
const app = express()
const port = process.env.port
const clientId = process.env.client_id

// help content
let addMeMsg =
  `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&permissions=51200&scope=bot`
//https://discordapp.com/api/oauth2/authorize?client_id=734409451162959962&permissions=51200&scope=bot
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
const bot = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES
  ]
})

bot.login(process.env.token)
const rest = new REST({ version: '9' }).setToken(process.env.token);

const registerCmds = async (botId, guildId) => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(botId, guildId),
      { body: commands },
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

bot.on('ready', (evt) => {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.user.username + ' - (' + bot.user.id + ')')
  logger.info(evt.guilds.cache)
  bot.guilds.cache.forEach(guild => {
    registerCmds(bot.user.id, guild.id)
  })
})

bot.on("guildCreate", guild => {
  registerCmds(bot.user.id, guild.id)
})

bot.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isCommand()) {
      const payload = JSON.parse(interaction.customId)
      if (payload.action === 'd20') {
        await diceRollInteraction.handled20Response(interaction)
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
    } else if (commandName === 'help') {
      await interaction.reply({ content: help.help1 })
      await interaction.followUp({ content: help.help2 })
    } else if (commandName === 'game') {
      const subCmd = options.getSubcommand()
      await diceRollInteraction.handleGame(interaction, subCmd)
    } else if (commandName === 'd6') {
      await diceRollInteraction.handleD6Roll(interaction)
    } else if (commandName === 'd20') {
      await diceRollInteraction.handleD20Roll(interaction)
    } else if (commandName === 'about') {
      await interaction.reply({
        content: about
      });
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
    } else if (commandName === 'support') {
      await interaction.reply({
        embeds: [utils.generateSupportCharacter()]
      });
    } else if (commandName === 'm' || commandName === 't') {
      await poolInteraction.buildPrompt(interaction, commandName)
    } else if (commandName === 'trait') {
      const subCmd = options.getSubcommand()
      await traitInteraction.buildPrompt(interaction, subCmd)
    } else if (commandName === 'pc') {
      const subCmd = options.getSubcommand()
      if (subCmd === 'list') {
        await rulesInteraction.handlePcList(interaction)
      } else if (subCmd === 'actions') {
        await rulesInteraction.handlePcAction(interaction)
      } else if (subCmd === 'minor-actions') {
        await rulesInteraction.handlePcMinorAction(interaction)
      } else if (subCmd === 'attack-properties') {
        await rulesInteraction.handlePcAttackProperty(interaction)
      }
    } else if (commandName === 'ship') {
      const subCmd = options.getSubcommand()
      if (subCmd === 'list') {
        await rulesInteraction.handleShipList(interaction)
      } else if ([
        'actions-page-1',
        'actions-page-2',
        'actions-page-3'].includes(subCmd)) {
        await rulesInteraction.handleShipAction(interaction)
      } else if (subCmd === 'minor-actions') {
        await rulesInteraction.handleShipMinorAction(interaction)
      } else if (subCmd === 'attack-properties') {
        await rulesInteraction.handleShipAttackProperty(interaction)
      } else if (subCmd === 'overview') {
        await rulesInteraction.handleShipOverview(interaction)
      }
    } else if (commandName === 'momentum') {
      await rulesInteraction.handleMomentum(interaction)
    } else if (commandName === 'determination') {
      await rulesInteraction.handleDetermination(interaction)
    }
  } catch (error) {
    await interaction.reply({
      content: error.toString()
    })
  }
})

bot.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

app.get('/', (req, res) => {
  res.send(`${process.env.bot_name} is up and running. Testing.`)
})

app.listen(port, () => {
  console.log(`${process.env.bot_name} listening on port ${port}`)
})
