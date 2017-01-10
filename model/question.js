'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('question:question');
const Schema = mongoose.Schema;
const Answer = require('./answer.js');

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  // userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  answersArray: [{ type: Schema.Types.ObjectId, ref: 'answer' }]
});

const Question = module.exports = mongoose.model('question', questionSchema);

Question.findByIdAndAddAnswer = function(id, answer) {
  debug('findByIdAndAddAnswer');

  return Question.findById(id)
  .then(question => {
    debug(question);
    answer.questionID = question._id;
    this.tempQuestion = question;
    return new Answer(answer).save();
  })
  .then(answer => {
    debug(this.tempQuestion.answers);
    this.tempQuestion.answersArray.push(answer._id);
    this.tempAnswer = answer;
    return this.tempQuestion.save();
  })
  .then(() => {
    return this.tempAnswer;
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};

Question.findByIdAndRemoveAnswer = function(id) {
  debug('findByIdAndRemoveAnswer');

  return Answer.findById(id)
  .then(answer => {
    this.tempAnswer = answer;
    return Answer.findByIdAndRemove(answer._id);
  })
  .then(() => Question.findById(this.tempAnswer.questionID))
  .then( question => {
    debug(question);
    question.answersArray.splice(question.answersArray.indexOf(this.tempAnswer._id), 1);
    question.save();
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
