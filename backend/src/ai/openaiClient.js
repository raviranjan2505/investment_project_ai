import OpenAI from 'openai';
import env from '../config/env.js';
import { badRequest } from '../utils/errors.js';

function getClient() {
  if (!env.openaiApiKey) throw badRequest('OpenAI API key is not configured');
  return new OpenAI({ apiKey: env.openaiApiKey });
}

export async function askJson(system, user) {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: env.openaiModel,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.2
  });
  return JSON.parse(response.choices[0].message.content);
}

export async function askText(system, user) {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: env.openaiModel,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.4
  });
  return response.choices[0].message.content;
}
