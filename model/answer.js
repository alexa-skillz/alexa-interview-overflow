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

//removed required in userID and questionID

//
// answerSchema.method('vote', function(vote, callback) {
//   if( vote === 'up') {
//     this.votes += 1;
//   } else {
//     this.votes -= 1;
//   }
//   this.parent().save(callback);
// });

module.exports = mongoose.model('answer', answerSchema);
