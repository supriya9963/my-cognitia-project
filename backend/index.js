require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const connectDB = require('./db');
const QA = require('./model');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});