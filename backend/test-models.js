// test-models.js - run with: node test-models.js
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY; // or whatever your env var is
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('Available models:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err);
  });