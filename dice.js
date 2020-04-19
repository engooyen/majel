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

module.exports = {
  globalComplication: 20,

  /**
   * Rolls a number of challenge dice (d6) equal to numDice. The results
   * will be formated and sent back into chat.
   * @param numDice The number of dice.
   * @returns Formatted result as a string/
   */
  rollD6Msg(numDice, userID) {
    let rawResult = ""
    let numericResult = 0
    let fxResult = 0
    for (let i = 0; i < numDice; ++i) {
      if (rawResult !== "") {
        rawResult += ", "
      }

      let roll = Math.floor(Math.random() * 6) + 1

      if (roll < 3) {
        numericResult += roll
      } else if (roll < 5) {
      } else {
        ++numericResult
        ++fxResult
      }

      rawResult += roll
    }

    let msg =
      "(" + rawResult + ") = " + numericResult + " with " + fxResult + " fx"
    msg = userID + " d6 Roll Result:\n" + msg

    return msg
  },

  rollD6(numDice) {
    let rawResult = ""
    let numericResult = 0
    let fxResult = 0
    for (let i = 0; i < numDice; ++i) {
      if (rawResult !== "") {
        rawResult += ", "
      }

      let roll = Math.floor(Math.random() * 6) + 1

      if (roll < 3) {
        numericResult += roll
      } else if (roll < 5) {
      } else {
        ++numericResult
        ++fxResult
      }

      rawResult += roll
    }

    return {
      rawResult,
      numericResult,
      fxResult
    }
  },

  /**
   * Rolls a number of d20 equal to numDice. The results will be formated
   * and sent back into chat.
   * @param numDice The number of dice.
   * @param args Additional parameters for the d20 roll if available.
   * args[0] is the target number.
   * args[1] is the critical range.
   * args[2] is the complication range.
   * @returns Formatted result as a string/
   */
  rollD20Msg(numDice, args, userID) {
    let rawResult = ""
    let critRange = 1
    let compRange = this.globalComplication
    let target = 20
    let success = 0
    let complication = 0

    if (args.length > 0) {
      target = parseInt(args[0])
    }

    if (args.length > 1) {
      critRange = parseInt(args[1])
    }

    if (args.length > 2) {
      compRange = parseInt(args[2])
    }

    for (let i = 0; i < numDice; ++i) {
      if (rawResult !== "") {
        rawResult += ", "
      }

      let roll = Math.floor(Math.random() * 20) + 1

      if (roll <= critRange) {
        ++success
      }

      if (roll >= compRange) {
        ++complication
      }

      if (roll <= target) {
        ++success
      }

      rawResult += roll
    }

    let msg =
      "Target = " +
      target +
      ", Critical range = " +
      critRange +
      ", Complication range = " +
      compRange
    msg +=
      "\n(" +
      rawResult +
      ") = " +
      success +
      " success / " +
      complication +
      " complication"
    msg = "<" + userID + "> d20 Roll Result:\n" + msg

    return msg
  },

  rollD20(numDice, args) {
    let rawResult = ""
    let critRange = 1
    let compRange = this.globalComplication
    let target = 20
    let success = 0
    let complication = 0

    if (args.length > 0) {
      target = parseInt(args[0])
    }

    if (args.length > 1) {
      critRange = parseInt(args[1])
    }

    if (args.length > 2) {
      compRange = parseInt(args[2])
    }

    for (let i = 0; i < numDice; ++i) {
      if (rawResult !== "") {
        rawResult += ", "
      }

      let roll = Math.floor(Math.random() * 20) + 1

      if (roll <= critRange) {
        ++success
      }

      if (roll >= compRange) {
        ++complication
      }

      if (roll <= target) {
        ++success
      }

      rawResult += roll
    }

    return {
      target,
      critRange,
      compRange,
      rawResult,
      success,
      complication
    }
  }
}
