// Cognitia AI Assistant - Backend Server
// Built with Express, Groq AI, and MongoDB Atlas
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const connectDB = require('./db');
const QA = require('./model');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

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