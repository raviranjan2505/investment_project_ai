// import OpenAI from 'openai';
// import env from '../config/env.js';
// import { badRequest } from '../utils/errors.js';

// function getClient() {
//   if (!env.openaiApiKey) throw badRequest('OpenAI API key is not configured');
//   return new OpenAI({ apiKey: env.openaiApiKey });
// }

// export async function askJson(system, user) {
//   const client = getClient();
//   const response = await client.chat.completions.create({
//     model: env.openaiModel,
//     response_format: { type: 'json_object' },
//     messages: [
//       { role: 'system', content: system },
//       { role: 'user', content: user }
//     ],
//     temperature: 0.2
//   });
//   return JSON.parse(response.choices[0].message.content);
// }

// export async function askText(system, user) {
//   const client = getClient();
//   const response = await client.chat.completions.create({
//     model: env.openaiModel,
//     messages: [
//       { role: 'system', content: system },
//       { role: 'user', content: user }
//     ],
//     temperature: 0.4
//   });
//   return response.choices[0].message.content;
// }
import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import { badRequest } from '../utils/errors.js';

function getClient() {
  if (!env.geminiApiKey) {
    throw badRequest('Gemini API key is not configured');
  }

  return new GoogleGenerativeAI(env.geminiApiKey);
}

/**
 * Return Gemini model (NO listModels — SDK does not support it)
 */
function getModel() {
  const client = getClient();

  return client.getGenerativeModel({
    model:'gemini-2.0-flash'
  });
}

/**
 * SAFE JSON PARSER (Gemini sometimes returns extra text)
 */
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    // Try to extract JSON block if model adds extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("Invalid JSON from Gemini: " + text);
  }
}

export async function askJson(system, user) {
  const model = getModel();

  const prompt = `
You are a strict JSON API.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanation

SYSTEM:
${system}

USER:
${user}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}

export async function askText(system, user) {
  const model = getModel();

  const prompt = `
SYSTEM:
${system}

USER:
${user}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}


// In your ai/openaiClient.js file
export async function listAvailableModels() {
  if (!env.geminiApiKey) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${env.geminiApiKey}`;
    console.log('Fetching models from:', url.replace(env.geminiApiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    // Check if models exist
    if (!data.models || !Array.isArray(data.models)) {
      console.log('No models array found in response');
      return [];
    }
    
    // Filter for models that support generateContent
    const generateContentModels = data.models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    // Format the response for better readability
    const formattedModels = generateContentModels.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedMethods: model.supportedGenerationMethods,
      version: model.version
    }));
    
    console.log(`Found ${formattedModels.length} models supporting generateContent`);
    return formattedModels;
    
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error; // Re-throw to be caught by the route handler
  }
}