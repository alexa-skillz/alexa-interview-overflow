'use strict';

const mongoose = require('mongoose');
// const answerSchema = require('./answer.js');


const Schema = mongoose.Schema;

const AnswerSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  votes: { type: Number, default:0 }
});

const QuestionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  answersArray: [AnswerSchema]
});


// const sortAnswers = function(a, b) {
//   if(a.votes === b.votes) {
//     return b.updated = a.updated;
//   }
//   return b.votes - a.votes;
// };
//
// questionSchema.pre('save', function(next) {
//   this.answers.sort(sortAnswers);
//   next();
// });
//
// answerSchema.method('update', function(updates, callback) {
//   Object.assign(this, updates, {updated: new Date()});
//   this.parent().save(callback);
// });
//
// answerSchema.method('vote', function(vote, callback) {
//   if( vote === 'up') {
//     this.votes += 1;
//   } else {
//     this.votes -= 1;
//   }
//   this.parent().save(callback);
// });


// var Question = module.exports.question = mongoose.model('question', questionSchema);
// module.exports = mongoose.model('answer', answerSchema);

var Question = mongoose.model('Question', QuestionSchema);

module.exports.Question = Question;
