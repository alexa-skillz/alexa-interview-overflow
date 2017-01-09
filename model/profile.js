'use strict';

const mongoose = require('mongoose');
const questionSchema = require('./question.js');
const answerSchema = require('./answer.js');

const Schema = mongoose.Schema;

const profileSchema = Schema({
  username: {type: String, required: true, unique: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  questions: [questionSchema],
  answers: [answerSchema],
});

module.exports = mongoose.model('profile', profileSchema);
