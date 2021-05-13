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

const os = require("os")
const utils = require("./utils")

// babble
const actions = []
const descriptors = []
const sources = []
const effects = []
const devices = []

// medbabble
const medActions = []
const medDescriptors = []
const medSystems = []

const pcMinorActions = utils.loadJsonFile("./data/pcMinorActions.json")
const pcActions = utils.loadJsonFile("./data/pcActions.json")
const pcAttackProperties = utils.loadJsonFile("./data/pcAttackProperties.json")
const determination = utils.loadJsonFile("./data/determination.json")
const momentum = utils.loadJsonFile("./data/momentum.json")
const shipMinorActions = utils.loadJsonFile("./data/shipMinorActions.json")
const shipActions = utils.loadJsonFile("./data/shipActions.json")
const shipActionsOverview = utils.loadJsonFile("./data/shipActionsOverview.json")
const shipAttackProperties = utils.loadJsonFile("./data/shipAttackProperties.json")

module.exports = {
  loadReferenceSheets: () => {
    // babble
    const fileContent = utils.loadFile("./data/babble.csv")
    const rows = fileContent.split(os.EOL)
    for (let i = 0; i < rows.length; ++i) {
      const columns = rows[i].split(", ")
      actions[actions.length] = columns[0]
      descriptors[descriptors.length] = columns[1]
      sources[sources.length] = columns[2]
      effects[effects.length] = columns[3]
      devices[devices.length] = columns[4]
    }

    // medbabble
    const medFileContent = utils.loadFile("./data/medbabble.csv")
    const medRows = medFileContent.split(os.EOL)
    for (let i = 0; i < rows.length; ++i) {
      const columns = medRows[i].split(", ")
      medActions[medActions.length] = columns[0]
      medDescriptors[medDescriptors.length] = columns[1]
      medSystems[medSystems.length] = columns[2]
    }
  },

  generateTechnobabble: () => {
    const action = utils.randomElement(actions)
    const descriptor = utils.randomElement(descriptors)
    const source = utils.randomElement(sources)
    const effect = utils.randomElement(effects)
    const device = utils.randomElement(devices)

    return (
      "Babble: [Action] [Descriptor] [Source] [Effect] [Device]\n" +
      `${action} ${descriptor} ${source} ${effect} ${device}`
    )
  },

  generateMedbabble: () => {
    const action = utils.randomElement(medActions)
    const descriptor = utils.randomElement(medDescriptors)
    const system = utils.randomElement(medSystems)

    return (
      "Medical Babble: [Action] [Descriptor] [Body system]\n" +
      `${action} ${descriptor} ${system}`
    )
  },
  pcMinorActions,
  pcActions,
  pcAttackProperties,
  determination,
  momentum,
  shipMinorActions,
  shipActions,
  shipActionsOverview,
  shipAttackProperties,
}
