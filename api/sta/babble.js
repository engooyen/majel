/**
 * Copyright 2019-2025 John H. Nguyen
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

const utils = resolveModule('api/utils')
const babble = resolveModule('data/babble.json')
const medBabble = resolveModule('data/medbabble.json')

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

for (let row of babble) {
  const columns = row.split(', ')
  actions[actions.length] = columns[0]
  descriptors[descriptors.length] = columns[1]
  sources[sources.length] = columns[2]
  effects[effects.length] = columns[3]
  devices[devices.length] = columns[4]
}

for (let row of medBabble) {
  const columns = row.split(', ')
  medActions[medActions.length] = columns[0]
  medDescriptors[medDescriptors.length] = columns[1]
  medSystems[medSystems.length] = columns[2]
}

module.exports = {
  generateTechnobabble: () => {
    const action = utils.randomElement(actions)
    const descriptor = utils.randomElement(descriptors)
    const source = utils.randomElement(sources)
    const effect = utils.randomElement(effects)
    const device = utils.randomElement(devices)

    return (
      'Techno Babble: [Action] [Descriptor] [Source] [Effect] [Device]\n' +
      `${action} ${descriptor} ${source} ${effect} ${device}`
    )
  },

  generateMedbabble: () => {
    const action = utils.randomElement(medActions)
    const descriptor = utils.randomElement(medDescriptors)
    const system = utils.randomElement(medSystems)

    return (
      'Medical Babble: [Action] [Descriptor] [Body system]\n' +
      `${action} ${descriptor} ${system}`
    )
  }
}
