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

const { SlashCommandBuilder } = require('discord.js');
const OpenAIApi = require('openai');
const systemPrompts = resolveModule('data/system-prompts.json');
const openai = new OpenAIApi({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_CHAT_BASE_PATH
});
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
        let response

        if (prompt.length > 2000) {
            await interaction.reply({
                content: `You've exceeded the 2000 character limit. Please try a shorter prompt.`
            });

            return
        }

        await interaction.deferReply();
        try {

            let context = contexts[guildId]
            if (!context) {
                context = []
                contexts[guildId] = context
            }

            context.push({
                role: 'user',
                content: prompt
            });
            let newContext = [...systemPrompts]
            newContext.push(...context)
            console.log('[query]', prompt)

            request.messages = newContext
            let tokens = 0
            for (let message of newContext) {
                tokens += message.content.split(' ').length
            }

            const maxTokens = request.max_tokens / 2
            let rebuildContext = tokens > maxTokens
            while (tokens > maxTokens) {
                tokens -= context[0].content.split(' ').length
                context.shift()
            }

            if (rebuildContext) {
                newContext = [...systemPrompts]
                newContext.push(...context)
            }

            response = await openai.chat.completions.create(request);
            await interaction.editReply({
                content: `[You]: ${prompt}`
            });

            const data = response
            const message = data.choices[0].message
            context.push(message)
            const content = message.content.split('\n\n')
            let reply = ''
            for (let i = 0; i < content.length; ++i) {
                const potentialReply = reply + content[i]
                if (potentialReply.length > 1950) {
                    await interaction.followUp({
                        content: `[Computer]: ${reply}`
                    });

                    reply = content[i]
                } else {
                    if (reply.length > 0) {
                        reply += '\n'
                    }
                    reply += content[i]
                }
            }

            if (reply) {
                await interaction.followUp({
                    content: `[Computer]: ${reply}`
                });
            }
            
        } catch (error) {
            await interaction.editReply({
                content: error.toString()
            });
        }
    },
};
