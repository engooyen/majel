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

let fs = require("fs")
let species = JSON.parse(
  fs.readFileSync("./data/species.json", { encoding: "utf8" })
)

module.exports = {
  /**
   * this.shuffles elements of an array and returns the this.shuffled array.
   * If you just need a random element, use this.randomElement instead, because
   * it does not operate on the whole array.
   * @param a The array to this.shuffle.
   * @return The this.shuffled array.
   */
  shuffle(a) {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }

    return a
  },

  /**
  * this.randomElement picks a random element from an array and returns it
  * @param a The non-empty array to pick a random element from
  * @return The picked element
  */
  randomElement(a) {
    if (a.length > 0) {
      return a[Math.floor(Math.random() * a.length)]
    } else {
      console.error("Tried picking a random element from empty array")
      return null
    }
  },
  /**
   * Lists supported species
   * @return Returns a list of supported species
   */
  listSpecies() {
    const list = species.map(s => s.Name)
    list.sort()
    return list.join(", ")
  },

  /**
   * Lists supported source books for species
   * @return Returns a list of supported sources
   */
  listSpeciesSources() {
    // remove duplicates by casting to Set and back
    const list = [...new Set(species.map(s => s.Source))]
    list.sort()
    return list.join(", ")
  },
  /**
   * Finds the attribute in a map and returns the modifier value. If the
   * attribute doesn't exist, 0 is returned.
   * @param name The name of the attribute.
   * @param attributes The key value map of attributes to modifier value.
   * @return The attribute modifier.
   */
  findAttribute(name, attributes) {
    return attributes[name] || 0
  },

  /**
   * Generates a random support character.
   * @return The generated support character as a string.
   */
  generateSupportCharacter() {
    species = this.shuffle(species)
    let race = species[0]
    let gender = this.randomElement(["Female", "Male"])
    let firstName = this.randomElement(race[gender])
    let lastName = this.randomElement(race["Family"])

    let randomAttributes = this.shuffle(["Control", "Daring", "Fitness", "Insight", "Presence", "Reason"])

    // Some species have ranomized attributes increased
    if (["Human", "Borg", "Hologram"].includes(race.Name)) {
      race.AttributeBonus = {}
      race.AttributeBonus[randomAttributes[0]] = 1
      race.AttributeBonus[randomAttributes[1]] = 1
      race.AttributeBonus[randomAttributes[2]] = 1
    }
    // Ktarian pick Control, Reason and {Fitness OR Presence}
    else if (race.Name === "Ktarian") {
      let ktarianAttribute = this.randomElement(["Fitness", "Presence"])
      race.AttributeBonus[ktarianAttribute] = 1
      //The other two are defined in the species file
    }

    let attributePool = this.shuffle([10, 10, 9, 9, 8, 7])
    let attributes = [
      "Control (" +
        (attributePool[0] +
          this.findAttribute("Control", race.AttributeBonus)) +
        ")",
      "Fitness (" +
        (attributePool[1] +
          this.findAttribute("Fitness", race.AttributeBonus)) +
        ")",
      "Presence (" +
        (attributePool[2] +
          this.findAttribute("Presence", race.AttributeBonus)) +
        ")",
      "Daring (" +
        (attributePool[3] + this.findAttribute("Daring", race.AttributeBonus)) +
        ")",
      "Insight (" +
        (attributePool[4] +
          this.findAttribute("Insight", race.AttributeBonus)) +
        ")",
      "Reason (" +
        (attributePool[5] + this.findAttribute("Reason", race.AttributeBonus)) +
        ")",
    ]

    let disciplinePool = this.shuffle([4, 3, 2, 2, 1, 1])
    let disciplines = [
      "Command (" + disciplinePool[0] + ")",
      "Conn (" + disciplinePool[1] + ")",
      "Security (" + disciplinePool[2] + ")",
      "Engineering (" + disciplinePool[3] + ")",
      "Science (" + disciplinePool[4] + ")",
      "Medicine (" + disciplinePool[5] + ")",
    ]

    let talent = this.randomElement(race.Talents)

    if (race.Source === undefined) {
      console.warn("Source book for " + race.Name + " is undefined")
    }

    return {
      title: firstName + " " + lastName,
      description: "Generated support character",
      fields: [
        {
          name: "Race",
          value: race.Name + " (" + race.Source + " source book)",
        },
        {
          name: "Gender",
          value: gender,
        },
        {
          name: "Attributes",
          value: attributes.join(", "),
        },
        {
          name: "Disciplines",
          value: disciplines.join(", "),
        },
        {
          name: "Talent",
          value: talent,
        },
      ],
    }
  },

  /**
   * Enumerates a dictionary and inserts a delimiter.
   * @param d The dictionary to enumerate.
   * @param delimiter The delimiter to insert between the key value pairs.
   */
  enumerateDictionary(d, delimiter) {
    let str = ""
    for (let key in d) {
      if (str) {
        str += delimiter
      }

      str += "**" + key + "**: " + d[key]
    }

    return str
  },

  getPlayerSheets(bot, callback) {
    let players = []
    let channels = bot.channels.array()
    for (let c in channels) {
      let channel = channels[c]
      if (channel.name.toLowerCase() === "player-sheets") {
        channel.fetchMessages().then((messages) => {
          try {
            let msgs = messages.array()
            for (let m in msgs) {
              let msg = msgs[m].content
              let player = {}
              let playerData = msg.split("\n")
              let collectTalents = false
              for (let i = 0; i < playerData.length; ++i) {
                if (playerData[i].indexOf("Talents") > -1) {
                  collectTalents = true
                  player["Talents"] = {}
                  continue
                }

                let kvp = playerData[i].split(": ")
                if (!collectTalents) {
                  if (kvp[0] === "Attributes") {
                    let attributes = kvp[1].split(" ")
                    player[kvp[0]] = {
                      Control: attributes[0],
                      Daring: attributes[1],
                      Fitness: attributes[2],
                      Insight: attributes[3],
                      Presence: attributes[4],
                      Reason: attributes[5],
                    }
                  } else if (kvp[0] === "Disciplines") {
                    let disciplines = kvp[1].split(" ")
                    player[kvp[0]] = {
                      Command: disciplines[0],
                      Conn: disciplines[1],
                      Security: disciplines[2],
                      Engineering: disciplines[3],
                      Science: disciplines[4],
                      Medicine: disciplines[5],
                    }
                  } else if (kvp[0] === "Systems") {
                    let systems = kvp[1].split(" ")
                    player[kvp[0]] = {
                      Engines: systems[0],
                      Computers: systems[1],
                      Weapons: systems[2],
                      Structure: systems[3],
                      Sensors: systems[4],
                      Communications: systems[5],
                    }
                  } else if (kvp[0] === "Departments") {
                    let departments = kvp[1].split(" ")
                    player[kvp[0]] = {
                      Command: departments[0],
                      Security: departments[1],
                      Science: departments[2],
                      Conn: departments[3],
                      Engineering: departments[4],
                      Medicine: departments[5],
                    }
                  } else {
                    player[kvp[0]] = kvp[1]
                  }
                } else {
                  player["Talents"][kvp[0]] = kvp[1]
                }
              }

              players.push(player)
            }
          } catch (error) {
            console.warn(error)
          }
        })

        callback(players)
        return
      }
    }
    console.warn("player-sheets channel not found on this server!")
  },
}
