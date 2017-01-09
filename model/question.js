'use strict';

const mongoose = require('mongoose');
const answerSchema = require('./answer.js');

const Schema = mongoose.Schema;

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  // userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  answers: [answerSchema]
});

const sortAnswers = function(a, b) {
  if(a.votes === b.votes) {
    return b.updated = a.updated;
  }
  return b.votes - a.votes;
};

questionSchema.pre('save', function(next) {
  this.answers.sort(sortAnswers);
  next();
});

module.exports = mongoose.model('question', questionSchema);
