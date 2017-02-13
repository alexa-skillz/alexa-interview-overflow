'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:question');
const Schema = mongoose.Schema;
const Answer = require('./answer.js');

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, default: Date.now },
  // userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  usersWhoUpvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  usersWhoDownvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }]
});

questionSchema.methods.upvote = function(user, callback) {
  if (this.usersWhoUpvoted.indexOf(user._id) == -1) {
    this.usersWhoUpvoted.push(user._id);
    this.upvotes++;

    if (this.usersWhoDownvoted.indexOf(user._id) != -1) {
      this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
      this.downvotes--;
    }

    this.save(callback);
  } else {
    this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
    this.upvotes--;

    this.save(callback);
  }
}

questionSchema.methods.downvote = function(user, callback) {
  if (this.usersWhoDownvoted.indexOf(user._id) == -1) {
    this.usersWhoDownvoted.push(user._id);
    this.downvotes++;

    if (this.usersWhoUpvoted.indexOf(user._id) != -1) {
      this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
      this.upvotes--;
    }

    this.save(callback);
  } else {
    this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
    this.downvotes--;

    this.save(callback);
  }
}

const Question = module.exports = mongoose.model('question', questionSchema);

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
    question.answers.splice(question.answers.indexOf(this.tempAnswer._id), 1);
    question.save();
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
