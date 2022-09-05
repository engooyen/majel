/**
 * Copyright 2019-2022 John H. Nguyen
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

const Discord = require('discord.js')
const builders = require('../interaction-builder')

module.exports = {
    async handleD6Roll(interaction) {
        const numDice = interaction.options.getInteger('x')
        const result = builders.rollD6(numDice, interaction)
        await interaction.reply({
          embeds: [result]
        });
    },
    async handleD20Roll(interaction) {
      const player = interaction.options.getUser('player')
      const target = interaction.options.getInteger('target')
      const difficulty = interaction.options.getInteger('difficulty')
      const crit = interaction.options.getInteger('crit')
      const comp = interaction.options.getInteger('comp')
      const options = []
      for (let i = 0; i < 5; ++i) {
          const dieValue = i + 1;
          options.push({
              label: `${dieValue} dice`,
              description: `Roll ${dieValue} dice`,
              value: JSON.stringify({
                  dice: dieValue,
                  target: target,
                  comp,
                  crit
              })
          })
      }

      const row = new Discord.MessageActionRow()
          .addComponents(
              new Discord.MessageSelectMenu()
                  .setCustomId(JSON.stringify({
                      action: 'd20'
                  }))
                  .setPlaceholder('Pick number of d20s to roll')
                  .addOptions(options)
          )

      const embed = new Discord.MessageEmbed()
          .setTitle('Roll d20')
          .setDescription('You have been chose to make this roll. Do not disappoint.')
          .setThumbnail('https://i.imgur.com/sBWwCxI.png')
          .addFields(
              {
                  name: "Target Roll",
                  value: (target).toString(),
                  inline: true,
              },
              {
                  name: "Critical",
                  value: crit.toString(),
                  inline: true,
              },
              {
                  name: "Complication",
                  value: comp.toString(),
                  inline: true,
              },
              {
                  name: "Difficulty",
                  value: difficulty.toString(),
                  inline: true,
              }
          )

      await interaction.reply({
          content: `<@${player.id}>}`,
          embeds: [embed],
          components: [row]
      })
    },
    async handled20Response(interaction) {
      const payload = JSON.parse(interaction.values[0])
      const numDice = payload.dice
      const target = payload.target
      const crit = payload.crit
      const comp = payload.comp
      const result = builders.rollD20(numDice, [target, crit, comp], interaction)
      await interaction.reply({
        embeds: [result]
      });
  }
}