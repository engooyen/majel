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

const alienGenerator = require("./alienGenerator")
const referenceSheets = require("./referenceSheets")
const utils = require("./utils")

referenceSheets.loadReferenceSheets()

module.exports = {
  buildPCMsg(option) {
    let msg = ""

    if (option === "minor actions") {
      msg = referenceSheets.pcMinorActionsAll
    } else if (option == "actions") {
      msg = referenceSheets.pcActionsAll
    } else if (option === "attack properties") {
      msg = referenceSheets.pcAttackProperties
    } else {
      msg = "**" + option.toUpperCase() + "**: "
      msg +=
        referenceSheets.pcMinorActions[option.toUpperCase()] ||
        referenceSheets.pcActions[option.toUpperCase()]
    }

    return msg
  },
  buildShipMsg(option) {
    let msg = ""

    if (option === "minor actions") {
      msg = referenceSheets.shipMinorActionsAll
    } else if (option == "actions") {
      msg = referenceSheets.shipActionsAll
    } else if (option === "attack properties") {
      msg = referenceSheets.shipAttackProperties
    } else {
      msg = "**" + option.toUpperCase() + "**: "
      msg +=
        referenceSheets.shipMinorActions[option.toUpperCase()] ||
        referenceSheets.shipActions[option.toUpperCase()]
    }

    return msg
  },
  buildDeterminationMsg(option) {
    let msg = ""

    if (!option) {
      msg = referenceSheets.determinationAll
    } else {
      msg = "**" + option.toUpperCase() + "**: "
      msg += determination[option.toUpperCase()]
    }

    return msg
  },
  buildPlayerStatsMsg(option, cmd, players) {
    let msg = ""

    if (!option) {
      msg = "**SHIP AND CREW**\n"
      for (let i = 0; i < players.length; ++i) {
        if (i > 0) {
          msg += ", "
        }

        msg += players[i].Name
      }
    } else {
      for (let i = 0; i < players.length; ++i) {
        let player = players[i]
        if (player.Name.toLowerCase().indexOf(option.toLowerCase()) > -1) {
          msg = "**" + player.Name + "**"

          if (cmd === "all" || cmd === "traits") {
            if (player.Traits) {
              msg += "\n**Traits**: " + player.Traits
            }
          }

          if (cmd === "all" || cmd === "stats") {
            if (player.Attributes) {
              msg +=
                "\n**Attributes**: " +
                utils.enumerateDictionary(player.Attributes, ", ")
            }

            if (player.Disciplines) {
              msg +=
                "\n**Disciplines**: " +
                utils.enumerateDictionary(player.Disciplines, ", ")
            }

            if (player.Systems) {
              msg +=
                "\n**Systems**: " +
                utils.enumerateDictionary(player.Systems, ", ")
            }

            if (player.Departments) {
              msg +=
                "\n**Departments**: " +
                utils.enumerateDictionary(player.Departments, ", ")
            }
          }

          if (cmd === "all" || cmd === "focuses") {
            if (player.Focuses) {
              msg += "\n**Focuses**: " + player.Focuses
            }
          }

          if (cmd === "all" || cmd === "values") {
            if (player.Values) {
              msg += "\n**Values**: " + player.Values
            }
          }

          if (cmd === "all" || cmd === "talents") {
            if (player.Talents) {
              msg +=
                "\n**Talents**\n" +
                utils.enumerateDictionary(player.Talents, "\n")
            }
          }

          break
        }
      }
    }

    return msg
  },
  buildGeneratedAlienMsg() {
    let msg = ""

    let alien = alienGenerator.alien()
    msg = "**GENERATED ALIEN**"
    for (let key in alien) {
      msg += "\n**" + key + "**: " + alien[key]
    }

    return msg
  }
}
