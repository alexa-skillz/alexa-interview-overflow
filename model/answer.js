'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = Schema({
  answer: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  votes: { type: Number, default:0 },
});

const sortAnswers = function(a, b) {
  if(a.votes === b.votes) {
    return b.updated -a.updated;
  }
  return b.votes - a.votes;
};


module.exports = mongoose.model('answer', answerSchema);
