'use strict';

const mongoose = require('mongoose');
const answerSchema = require('./answer.js');
const questionSchema = require('./question.js');

const Schema = mongoose.Schema;

const profileSchema = Schema({
  username: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  answers: [answerSchema],
  questions: [questionSchema],
  created: {type: Date, default: Date.now},
  profileName: {type: String, unique: true},
  bio: {type:String},
  primaryLanguage: {type: String}
});

module.exports = mongoose.model('profile', profileSchema);
