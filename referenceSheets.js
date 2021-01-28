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

var fs = require("fs")
var os = require("os")

// babble
var actions = []
var descriptors = []
var sources = []
var effects = []
var devices = []

// medbabble
var medActions = []
var medDescriptors = []
var medSystems = []

module.exports = {
  loadReferenceSheets: function () {
    // babble
    var fileContent = fs.readFileSync("./data/babble.csv", { encoding: "utf8" })
    var rows = fileContent.split(os.EOL)
    for (let i = 0; i < rows.length; ++i) {
      let columns = rows[i].split(", ")
      actions[actions.length] = columns[0]
      descriptors[descriptors.length] = columns[1]
      sources[sources.length] = columns[2]
      effects[effects.length] = columns[3]
      devices[devices.length] = columns[4]
    }

    // medbabble
    var medFileContent = fs.readFileSync("./data/medbabble.csv", { encoding: "utf8" })
    var medRows = medFileContent.split(os.EOL)
    for (let i = 0; i < rows.length; ++i) {
      let columns = medRows[i].split(", ")
      medActions[medActions.length] = columns[0]
      medDescriptors[medDescriptors.length] = columns[1]
      medSystems[medSystems.length] = columns[2]
    }

    this.pcMinorActions = JSON.parse(
      fs.readFileSync("./data/pcMinorActions.json", { encoding: "utf8" })
    )
    this.pcActions = JSON.parse(
      fs.readFileSync("./data/pcActions.json", { encoding: "utf8" })
    )
    this.pcAttackProperties = JSON.parse(
      fs.readFileSync("./data/pcAttackProperties.json", {
        encoding: "utf8",
      })
    )

    this.determination = JSON.parse(
      fs.readFileSync("./data/determination.json", { encoding: "utf8" })
    )
    this.momentum = JSON.parse(
      fs.readFileSync("./data/momentum.json", { encoding: "utf8" })
    )

    this.shipMinorActions = JSON.parse(
      fs.readFileSync("./data/shipMinorActions.json", { encoding: "utf8" })
    )
    this.shipActions = JSON.parse(
      fs.readFileSync("./data/shipActions.json", { encoding: "utf8" })
    )

    this.shipActionsOverview = JSON.parse(
      fs.readFileSync("./data/shipActionsOverview.json", {
        encoding: "utf8",
      })
    )
    this.shipAttackProperties = JSON.parse(
      fs.readFileSync("./data/shipAttackProperties.json", { encoding: "utf8" })
    )
  },

  generateTechnobabble: function () {
    let action = utils.randomElement(actions)
    let descriptor = utils.randomElement(descriptors)
    let source = utils.randomElement(sources)
    let effect = utils.randomElement(effects)
    let device = utils.randomElement(devices)

    return (
      "Babble: [Action] [Descriptor] [Source] [Effect] [Device]\n" +
      action +
      " " +
      descriptor +
      " " +
      source +
      " " +
      effect +
      " " +
      device
    )
  },

  generateMedbabble: function () {
    let action = utils.randomElement(medActions)
    let descriptor = utils.randomElement(medDescriptors)
    let system = utils.randomElement(medSystems)

    return (
      "Medical Babble: [Action] [Descriptor] [Body system]\n" +
      action +
      " " +
      descriptor +
      " " +
      system
    )
  },
}
