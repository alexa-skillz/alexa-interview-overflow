'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  answersArray: [{ type: Schema.Types.ObjectId, ref: 'answer' }]
});

module.exports = mongoose.model('question', questionSchema);
