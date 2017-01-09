'use strict';

const mongoose = require('mongoose');
// const answerSchema = require('answer.js');

const Schema = mongoose.Schema;

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true }
  // answers: [answerSchema],
});

module.exports = mongoose.model('question', questionSchema);
