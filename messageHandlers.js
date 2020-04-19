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

const dice = require("./dice")

module.exports = {
  //   goldendelicious d6 Roll Result:
  // (2, 4, 4) = 2 with 0 fx
  handleD6Cmd(cmd, msg) {
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
        url: "https://i.imgur.com/gN5LDfH.png"
      },
      fields: [
        {
          name: "Raw Result",
          value: rawResult,
          inline: true
        },
        {
          name: "Numeric Result",
          value: numericResult,
          inline: true
        },
        {
          name: "FX Result",
          value: fxResult,
          inline: true
        }
      ]
    }

    console.warn(embed)
    msg.channel.send({ embed })
  },

  //   <@goldendelicious> d20 Roll Result:
  // Target = 20, Critical range = 1, Complication range = 20
  // (9, 20) = 2 success / 1 complication
  handleD20Cmd(cmd, args, msg) {
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
      complication
    } = dice.rollD20(numDice, args)

    const embed = {
      title: msg.author.username,
      description: "d20 Roll Result",
      thumbnail: {
        url: "https://i.imgur.com/sBWwCxI.png"
      },
      fields: [
        {
          name: "Target",
          value: target,
          inline: true
        },
        {
          name: "Critical Range",
          value: critRange,
          inline: true
        },
        {
          name: "Complication Range",
          value: compRange,
          inline: true
        },
        {
          name: "Raw Result",
          value: rawResult,
          inline: true
        },
        {
          name: "Success(es)",
          value: success,
          inline: true
        },
        {
          name: "Complication(s)",
          value: complication,
          inline: true
        }
      ]
    }

    console.warn(embed)
    msg.channel.send({ embed })
  }
}
