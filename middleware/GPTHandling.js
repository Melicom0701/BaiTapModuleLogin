const axios = require('axios');
const prompt = 'Hello, how are you?';
const maxTokens = 50;
const temperature = 0.5;
const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const apiKey = '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';

const data = {
  prompt: prompt,
  max_tokens: maxTokens,
  temperature: temperature
};

const config = {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
};

axios.post(apiUrl, data, config)
  .then(response => {
    console.log(response.data.choices[0].text);
  })
  .catch(error => {
    console.log(error);
  });






