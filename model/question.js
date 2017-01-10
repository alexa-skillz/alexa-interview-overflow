'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('answer:question');

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  answersArray: [{ type: Schema.Types.ObjectId, ref: 'answer' }]
});

// const sortAnswers = function(a, b) {
//   if(a.votes === b.votes) {
//     return b.updated = a.updated;
//   }
//   return b.votes - a.votes;
// };

module.exports = mongoose.model('question', questionSchema);
