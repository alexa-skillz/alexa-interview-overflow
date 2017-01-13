'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId },
  votes: { type: Number, default:0 },
  questionID: {type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('answer', answerSchema);
