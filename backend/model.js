// QA Model - Defines MongoDB Schema
// Stores user questions and AI generated answers with timestamps
const mongoose = require('mongoose');
const qaSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QA', qaSchema);