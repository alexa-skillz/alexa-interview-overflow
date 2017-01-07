'use strict';

const mongoose = require('mongoose');
const answerSchema = require('answer.js');

const Schema = mongoose.Schema;

const questionSchema = Schema({
  question: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  answers: [answerSchema],
});

module.exports = mongoose.model('question', questionSchema);
