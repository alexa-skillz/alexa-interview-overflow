'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('alexa-skillz:answer');
const Schema = mongoose.Schema;
debug('answerSchema');

const answerSchema = Schema({
  content: { type: String, required: true },
  // created: { type: Date, default: Date.now },
  // updated: { type: Date, default: Date.now },
  // userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  // votes: { type: Number, default:0 },
  questionID: {type: Schema.Types.ObjectId, required: true}
});

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
