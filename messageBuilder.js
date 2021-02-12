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

const alienGenerator = require("./alienGenerator")
const dice = require("./dice")
const referenceSheets = require("./referenceSheets")

referenceSheets.loadReferenceSheets()

module.exports = {
  //   goldendelicious d6 Roll Result:
  // (2, 4, 4) = 2 with 0 fx
  buildD6Msg(cmd, msg) {
    let numDice = cmd.replace("d6", "")
    if (numDice === "") {
      numDice = "1"
    }
    numDice = parseInt(numDice)
    const { rawResult, numericResult, fxResult } = dice.rollD6(numDice)

    const embed = {
      title: msg.author.username,
      description: "d6 Roll Result",
      thumbnail: {
        url: "https://i.imgur.com/gN5LDfH.png",
      },
      fields: [
        {
          name: "Raw Result",
          value: rawResult,
          inline: true,
        },
        {
          name: "Numeric Result",
          value: numericResult,
          inline: true,
        },
        {
          name: "FX Result",
          value: fxResult,
          inline: true,
        },
      ],
    }

    console.warn(embed)
    msg.channel.send({ embed })
  },

  //   <@goldendelicious> d20 Roll Result:
  // Target = 20, Critical range = 1, Complication range = 20
  // (9, 20) = 2 success / 1 complication
  buildD20msg(cmd, args, msg) {
    let numDice = cmd.replace("d20", "")
    if (numDice === "") {
      numDice = "1"
    }
    numDice = parseInt(numDice)

    const {
      target,
      critRange,
      compRange,
      rawResult,
      success,
      complication,
    } = dice.rollD20(numDice, args)

    const embed = {
      title: msg.author.username,
      description: "d20 Roll Result",
      thumbnail: {
        url: "https://i.imgur.com/sBWwCxI.png",
      },
      fields: [
        {
          name: "Target",
          value: target,
          inline: true,
        },
        {
          name: "Critical Range",
          value: critRange,
          inline: true,
        },
        {
          name: "Complication Range",
          value: compRange,
          inline: true,
        },
        {
          name: "Raw Result",
          value: rawResult,
          inline: true,
        },
        {
          name: "Success(es)",
          value: success,
          inline: true,
        },
        {
          name: "Complication(s)",
          value: complication,
          inline: true,
        },
      ],
    }

    msg.channel.send({ embed })
  },

  buildPCMsg(option) {
    const embed = {
      title: "",
      fields: [],
    }

    if (option === "minor actions") {
      embed.title = "PC MINOR ACTIONS"
      for (let key in referenceSheets.pcMinorActions) {
        embed.fields.push({
          name: key,
          value: referenceSheets.pcMinorActions[key],
        })
      }
    } else if (option == "actions") {
      embed.title = "PC ACTIONS"
      for (let key in referenceSheets.pcActions) {
        embed.fields.push({
          name: key,
          value: referenceSheets.pcActions[key],
        })
      }
    } else if (option === "attack properties") {
      embed.title = "PC ATTACK PROPERTIES"
      for (let key in referenceSheets.pcAttackProperties) {
        embed.fields.push({
          name: key,
          value: referenceSheets.pcAttackProperties[key],
        })
      }
    } else {
      embed.title = option.toUpperCase()
      embed.description =
        referenceSheets.pcMinorActions[embed.title] ||
        referenceSheets.pcActions[embed.title]
    }

    return embed
  },
  buildShipMsg(option) {
    const embed = {
      title: "",
      fields: [],
    }

    if (option === "minor actions") {
      embed.title = "SHIP MINOR ACTIONS"
      for (let key in referenceSheets.shipMinorActions) {
        embed.fields.push({
          name: key,
          value: referenceSheets.shipMinorActions[key],
        })
      }
    } else if (option == "actions") {
      embed.title = "SHIP ACTIONS OVERVIEW"
      embed.description = "Available ship actions by station."
      for (let key in referenceSheets.shipActionsOverview) {
        embed.fields.push({
          name: key,
          value: referenceSheets.shipActionsOverview[key],
        })
      }
    } else if (option === "attack properties") {
      embed.title = "SHIP ATTACK PROPERTIES"
      for (let key in referenceSheets.shipAttackProperties) {
        embed.fields.push({
          name: key,
          value: referenceSheets.shipAttackProperties[key],
        })
      }
    } else {
      embed.title = option.toUpperCase()
      const shipActionsCategory =
        referenceSheets.shipActionsOverview[embed.title]
      if (shipActionsCategory) {
        embed.title = `SHIP ACTIONS - ${option.toUpperCase()}`
        const actions = shipActionsCategory.toString().split(", ")
        for (let i in actions) {
          const actionName = actions[i].toUpperCase()
          embed.fields.push({
            name: actionName,
            value: referenceSheets.shipActions[actionName],
          })
        }
      } else {
        embed.description =
          referenceSheets.shipMinorActions[embed.title] ||
          referenceSheets.shipActions[embed.title]
      }
    }

    return embed
  },
  buildDeterminationMsg() {
    const embed = {
      title: "DETERMINATION SPENDS",
      fields: [],
    }

    const determinationSpends = referenceSheets.determination
    for (let key in determinationSpends) {
      embed.fields.push({
        name: key,
        value: determinationSpends[key],
      })
    }

    console.warn(embed)
    return embed
  },
  buildMomentumMsg() {
    const embed = {
      title: "MOMENTUM SPENDS",
      fields: [],
    }

    const momentumSpends = referenceSheets.momentum
    for (let key in momentumSpends) {
      embed.fields.push({
        name: key,
        value: momentumSpends[key],
      })
    }

    console.warn(embed)
    return embed
  },
  buildGeneratedAlienMsg() {
    const embed = {
      title: "GENERATED ALIEN",
      fields: [],
    }

    let alien = alienGenerator.alien()
    for (let key in alien) {
      if (key !== "Traits") {
        embed.fields.push({
          name: key,
          value: alien[key],
        })
      } else {
        embed.fields.push({
          name: "Trait - " + alien[key].name,
          value: alien[key].description,
          inline: true,
        })
      }
    }

    return embed
  },
}
