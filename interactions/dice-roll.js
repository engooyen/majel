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

const { EmbedBuilder } = require('discord.js');
const builders = resolveModule('api/interaction-builder')
const { GameConfig } = resolveModule('api/game-config')
const is2d20Feature = process.env.feature_2d20

module.exports = {
  async handleGame(interaction, subCmd) {
    const game = interaction.options.getString('game')
    const cmd = interaction.options.getString('cmd')
    const gameConfig = new GameConfig(interaction.guild, interaction.user.username)
    if (subCmd === 'list') {
      await interaction.reply({
        embeds: [gameConfig.supportedGames()]
      })
    } else if (subCmd === 'help') {
      await interaction.reply({
        embeds: [await gameConfig.supportedCustomCmds()]
      })
    } else if (subCmd === 'set') {
      await interaction.reply({
        embeds: [await gameConfig.setGame(game)]
      })
    } else if (subCmd === 'custom') {
      await interaction.reply({
        embeds: [await gameConfig.runCustomCmd(cmd)]
      })
    }
  },
  async handleD20Roll(interaction) {
    const target = interaction.options.getInteger('target')
    const difficulty = interaction.options.getInteger('difficulty') || 0
    const crit = interaction.options.getInteger('crit') || 1
    const comp = interaction.options.getInteger('comp') || 20
    const dice = interaction.options.getInteger('dice') || 2
    const gameConfig = new GameConfig(interaction.guild)
    const game = await gameConfig.getGame()

    if (is2d20Feature && !game) {
      const warning = new EmbedBuilder()
        .setTitle('Game not set!')
        .setDescription('/game set [game] to set game and /game list to show supported games.')

      await interaction.reply({
        embeds: [warning]
      })

      return
    }
    
    const result = builders.rollD20(dice, [target, crit, comp, difficulty], interaction, game)
    await interaction.reply({
      embeds: [result],
    })
  },
  async handleD20RollRaw(interaction) {
    try {
      const params = interaction.options.getString('params').split(' ')
      let dice = 2
      let target = 10
      let difficulty = 0
      let crit = 1
      let comp = 20

      if (params.length > 0) {
        target = parseInt(params[0])
      }

      if (params.length > 1) {
        dice = parseInt(params[1]) || 2
      }

      if (params.length > 2) {
        difficulty = parseInt(params[2]) || 0
      }

      if (params.length > 3) {
        crit = parseInt(params[3]) || 1
      }

      if (params.length > 4) {
        comp = parseInt(params[4]) || 20
      }

      const gameConfig = new GameConfig(interaction.guild)
      const game = await gameConfig.getGame()
      if (is2d20Feature && !game) {
        const warning = new EmbedBuilder()
          .setTitle('Game not set!')
          .setDescription('/game set [game] to set game and /game list to show supported games.')

        await interaction.reply({
          embeds: [warning]
        })

        return
      }

      const result = builders.rollD20(dice, [target, crit, comp, difficulty], interaction, game)
      await interaction.reply({
        embeds: [result],
      })
    } catch (error) {
      await interaction.reply({
        content: error.toString()
      })
    }
  },
  async handled20Response(interaction) {
    const gameConfig = new GameConfig(interaction.guild)
    const payload = JSON.parse(interaction.values[0])
    const numDice = payload.dice
    const target = payload.target
    const crit = payload.crit
    const comp = payload.comp
    const result = builders.rollD20(numDice, [target, crit, comp], interaction, await gameConfig.getGame())
    await interaction.reply({
      embeds: [result]
    });
  }
}