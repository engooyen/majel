/**
 * Copyright 2019-2023 John H. Nguyen
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

const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const trainingData = resolveModule('data/training-data.json');
const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_CHAT_BASE_PATH
});
const openai = new OpenAIApi(configuration);
const contexts = {};
const request = {
    model: process.env.OPENAI_MODEL,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
    max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS),
    messages: [],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('computer')
        .setDescription('Ask the computer anything.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The query to ask the computer.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt')
        const guildId = interaction.guildId
        await interaction.deferReply();
        let response
        try {

            let context = contexts[guildId]
            if (!context) {
                context = trainingData
                contexts[guildId] = context
            }

            context.push({
                role: 'user',
                content: prompt
            });
            console.log('[query]', prompt)

            request.messages = context

            response = await openai.createCompletion(request);
            const message = response.data.choices[0].message
            const content = message.content.split('\n\n').join('\n')
            context.push(message)
            
            await interaction.editReply({
                content: `\n[You]: ${prompt}\n\n[Computer]: ${content}`
            });
        } catch (error) {
            await interaction.editReply({
                content: error
            });
        }
    },
};
