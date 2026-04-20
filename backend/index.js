// Cognitia AI Assistant - Backend Server
// Built with Express, Groq AI, and MongoDB Atlas
const express = require('express');
const Groq = require('groq-sdk');
const connectDB = require('./db');
const QA = require('./model');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.get('/', async (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.post('/api/ask', async (req, res) => {
  try {
    await connectDB();

    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'llama-3.1-8b-instant',
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'No response received';

    const record = new QA({ question, answer });
    await record.save();

    res.json({ answer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = app;