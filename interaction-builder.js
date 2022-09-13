/**
 * Copyright 2019-2022 John H. Nguyen
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

const { MessageEmbed } = require('discord.js');
const alienGenerator = require('./alien-generator')
const dice = require('./dice')
const pcActions = require('./data/pc-actions.json')
const pcMinorActions = require('./data/pc-minor-actions.json')
const pcAttackProperties = require('./data/pc-attack-properties.json')
const shipActions = require('./data/ship-actions.json')
const shipMinorActions = require('./data/ship-minor-actions.json')
const shipAttackProperties = require('./data/ship-attack-properties.json')
const determination = require('./data/determination.json')
const momentum = require('./data/momentum.json')
const is2d20Feature = process.env.feature_2d20

module.exports = {
  rollD6(numDice, msg, game) {
    const { rawResult, numericResult, fxResult, rawResultValues } = dice.rollD6(numDice)
    if (is2d20Feature && !game) {
      return new MessageEmbed()
      .setTitle('Game not set!')
      .setDescription('/game set [game] to set game and /game list to show supported games.')
    }

    return new MessageEmbed()
      .setTitle(msg.user.username)
      .setDescription('D6 Roll Result\n<:d6_0:1019054096658989076> = 0\n<:d6_1:1019054097657241650> = 1\n<:d6_2:1019054098382856304> = 2\n<:d6_fx:1019054099817308202> = 1, plus Effect')
      .setThumbnail(game.images.d6)
      .addFields(
        {
          name: 'Numeric Result',
          value: numericResult.toString(),
          inline: true,
        },
        {
          name: 'FX Result',
          value: fxResult.toString(),
          inline: true,
        },
        {
          name: 'Raw Result',
          value: rawResult,
        },
        {
          name: 'Raw Result Numeric',
          value: rawResultValues,
        },
      )
  },

  rollD20(numDice, args, msg, game) {
    const {
      target,
      critRange,
      compRange,
      rawResult,
      success,
      complication,
      difficulty
    } = dice.rollD20(numDice, args)

    if (is2d20Feature && !game) {
      return new MessageEmbed()
      .setTitle('Game not set!')
      .setDescription('/game set [game] to set game and /game list to show supported games.')
    }

    return new MessageEmbed()
      .setTitle(msg.user.username)
      .setDescription('D20 Roll Result')
      .setThumbnail(game.images.d20)
      .addFields(
        {
          name: 'Target',
          value: target.toString(),
          inline: true,
        },
        {
          name: 'Difficulty',
          value: difficulty.toString(),
          inline: true,
        },
        {
          name: 'Critical Range',
          value: critRange.toString(),
          inline: true,
        },
        {
          name: 'Complication Range',
          value: compRange.toString(),
          inline: true,
        },
        {
          name: 'Raw Result',
          value: rawResult,
          inline: true,
        },
        {
          name: 'Success(es)',
          value: success.toString(),
          inline: true,
        },
        {
          name: 'Complication(s)',
          value: complication.toString(),
          inline: true,
        }
      )
  },

  pcLookup(topic, action) {
    let description = ''
    if (topic === 'actions') {
      description = pcActions[action]
    } else if (topic === 'minoractions') {
      description = pcMinorActions[action]
    } else if (topic === 'attackproperties') {
      description = pcAttackProperties[action]
    }

    return new MessageEmbed()
      .setTitle(action)
      .setDescription(description)
  },

  shipLookup(topic, action) {
    let description = ''
    if (topic === 'minoractions') {
      description = shipMinorActions[action]
    } else if (topic === 'attackproperties') {
      description = shipAttackProperties[action]
    } else {
      description = shipActions[action]
    }

    return new MessageEmbed()
      .setTitle(action)
      .setDescription(description)
  },

  metaLookup(topic) {
    const fields = []
    if (topic === 'momentum') {
      for (let key in momentum) {
        fields.push({
          name: key,
          value: momentum[key]
        })
      }
    } else if (topic === 'determination') {
      for (let key in determination) {
        fields.push({
          name: key,
          value: determination[key]
        })
      }
    }

    return new MessageEmbed()
      .setTitle(`${topic.toUpperCase()} SPENDS`)
      .addFields(...fields)
  },

  generateAlien() {
    const fields = []

    let alien = alienGenerator.alien()
    for (let key in alien) {
      if (key !== 'Traits') {
        fields.push({
          name: key,
          value: alien[key],
        })
      } else {
        fields.push({
          name: 'Trait - ' + alien[key].name,
          value: alien[key].description,
          inline: true,
        })
      }
    }

    return new MessageEmbed()
      .setTitle('GENERATED ALIEN')
      .addFields(...fields)
  },
}
