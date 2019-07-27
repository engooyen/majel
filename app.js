/**
 * Copyright 2019 John H. Nguyen
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

const Discord = require("discord.io")
const winston = require("winston")
const fs = require("fs")
const utils = require("./utils")
const referenceSheets = require("./referenceSheets")
const sta = require("./sta")
const msgBuilder = require("./messageBuilder")
const msgHandlers = require("./messageHandlers")
require("dotenv").config()

//sta.loadSourceBook()

//Configure logger settings
let logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: {
    service: "user-service"
  },
  transports: [new winston.transports.Console()]
})

// Initialize Discord Bot
let bot = new Discord.Client({
  token: process.env.token,
  autorun: true
})

referenceSheets.loadReferenceSheets()

// help content
let help1 = fs.readFileSync("./data/help1.txt", { encoding: "utf8" })
let help2 = fs.readFileSync("./data/help2.txt", { encoding: "utf8" })

let players = []

bot.on("ready", function(evt) {
  logger.info("Connected")
  logger.info("Logged in as: ")
  logger.info(bot.username + " - (" + bot.id + ")")
  players = utils.getPlayerSheets(bot)
})

bot.on("message", function(user, userID, channelID, message, evt) {
  try {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    let msg = ""
    if (message.substring(0, 1) == "!") {
      let args = message.substring(1).split(" ")
      let cmd = args[0]

      args = args.splice(1)
      let isD6 = cmd.indexOf("d6") > -1
      let isD20 = cmd.indexOf("d20") > -1

      if (isD6) {
        msgHandlers.handleD6Cmd(cmd, bot, userID, channelID)
        return
      } else if (isD20) {
        msgHandlers.handleD20Cmd(cmd, args, bot, userID, channelID)
        return
      }

      let option = args.length > 0 ? args.join(" ").toLowerCase() : ""
      switch (cmd) {
        case "help":
          bot.sendMessage({ to: channelID, message: help1 })
          bot.sendMessage({ to: channelID, message: help2 })
          break
        case "support":
          msg = utils.generateSupportCharacter()
          break
        // !babble
        case "babble":
          msg = "<@" + userID + "> Technobabble generated. Check your DM."
          bot.sendMessage({
            to: userID,
            message: referenceSheets.generateTechnobabble()
          })
          break
        case "pc":
          msg = msgBuilder.buildPCMsg(option)
          break
        case "ship":
          msg = msgBuilder.buildShipMsg(option)
          break
        case "determination":
          msg = msgBuilder.buildDeterminationMsg(option)
          break
        case "all":
        case "focuses":
        case "stats":
        case "talents":
        case "traits":
        case "values":
          msg = msgBuilder.buildPlayerStatsMsg(option, cmd, players)
          break
        case "alien":
          msg = msgBuilder.buildGeneratedAlienMsg()
        case "refresh":
          players = utils.getPlayerSheets(bot)
          break
      }
    }

    bot.sendMessage({ to: channelID, message: msg })
  } catch (error) {
    bot.sendMessage({
      to: channelID,
      message: "Error trying to handle: " + message + "\n" + error
    })
  }
})
