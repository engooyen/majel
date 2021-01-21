/**
 * Copyright 2019-2020 John H. Nguyen
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

const Discord = require("discord.js")
const winston = require("winston")
const fs = require("fs")
const utils = require("./utils")
const referenceSheets = require("./referenceSheets")
const msgBuilder = require("./messageBuilder")
const pool = require("./pool")
require("dotenv").config()

referenceSheets.loadReferenceSheets()

// help content
let help1 = fs.readFileSync("./data/help1.txt", { encoding: "utf8" })
let help2 = fs.readFileSync("./data/help2.txt", { encoding: "utf8" })
let about = fs.readFileSync("./data/about.txt", { encoding: "utf8" })

let addMeMsg =
  "https://discordapp.com/api/oauth2/authorize?client_id=538555398521618432&permissions=51200&scope=bot"

const CommandPrefix = process.env.prefix
if (CommandPrefix === "/") {
  help1 = help1.split("!").join("/")
  help2 = help2.split("!").join("/")
  addMeMsg =
    "https://discordapp.com/api/oauth2/authorize?client_id=729181873024139294&permissions=51200&scope=bot"
}

//Configure logger settings
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  defaultMeta: {
    service: "user-service",
  },
  transports: [new winston.transports.Console()],
})

const betaTesters = process.env.beta_testers
  ? process.env.beta_testers.split(",")
  : []

// Initialize Discord Bot
const bot = new Discord.Client()

bot.login(process.env.token)

bot.on("ready", (evt) => {
  logger.info("Connected")
  logger.info("Logged in as: ")
  logger.info(bot.user.username + " - (" + bot.user.id + ")")
})

bot.on("message", async (message) => {
  if (message.author.username.indexOf("Majel") > -1) {
    console.log("Preventing Majel from spamming.")
    return
  }

  try {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    let msg = ""
    let embed = null
    const cmdPrefix = message.content.substring(0, 1)
    if (CommandPrefix === cmdPrefix) {
      let args = message.content.substring(1).split(" ")
      let cmd = args[0]
      args = args.splice(1)
      let isD6 = cmd.indexOf("d6") > -1
      let isD20 = cmd.indexOf("d20") > -1
      if (isD6) {
        msgBuilder.buildD6Msg(cmd, message)
        return
      } else if (isD20) {
        msgBuilder.buildD20msg(cmd, args, message)
        return
      }

      let option = args.length > 0 ? args.join(" ").toLowerCase() : ""
      switch (cmd) {
        case "help":
          message.channel.send(help1)
          message.channel.send(help2)
          return
        case "about":
          message.channel.send(about)
          return
        case "support":
          if (option.includes("list")) {
            msg = "Supported species: " + utils.listSpecies()
          } else {
            embed = utils.generateSupportCharacter()
          }
          break
        // !babble
        case "babble":
          msg = message.author + " Technobabble generated. Check your DM."
          message.author.send(referenceSheets.generateTechnobabble())
          break
        case "medbabble":
          msg = message.author + " Medical babble generated. Check your DM."
          message.author.send(referenceSheets.generateMedbabble())
          break
        case "pc":
          embed = msgBuilder.buildPCMsg(option)
          break
        case "ship":
          embed = msgBuilder.buildShipMsg(option)
          break
        case "determination":
          embed = msgBuilder.buildDeterminationMsg()
          break
        case "momentum":
          embed = msgBuilder.buildMomentumMsg()
          break
        case "alien":
          embed = msgBuilder.buildGeneratedAlienMsg()
          break
        case "addme":
          msg = addMeMsg
          break
        case "pool":
          embed = await pool.status(message, option)
          break
        case "m":
          embed = await pool.adjustMomentum(message, option)
          break
        case "t":
          embed = await pool.adjustThreat(message, option)
          break
        case "beta":
          if (betaTesters.includes(message.guild.id.toString())) {
            msg = "You have access to the beta features."
          } else {
            msg = "You don't have access to the beta features."
          }
          break
        default:
          // if (betaTesters.includes(message.guild.id.toString())) {
          //   switch (cmd) {
          //     default:
          //       msg = `Didn't recognize '${cmd}' please type !help for supported commands.`
          //   }
          // } else {
          //   msg = `Didn't recognize '${cmd}' please type !help for supported commands.`
          // }
          msg = `Didn't recognize '${cmd}' please type !help for supported commands.`
      }
    }

    if (msg) {
      message.channel.send(msg)
    } else if (embed) {
      message.channel.send({ embed })
    }
  } catch (error) {
    console.error(error)
    message.channel.send(error)
  }
})
