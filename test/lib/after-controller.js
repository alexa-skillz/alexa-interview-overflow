'use strict';

const User = require('../../model/user.js');
const Answer = require('../../model/answer.js');
const Question = require('../../model/question.js');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

module.exports = exports = {};

exports.killAllDataBase = function(done) {
  Promise.all([
    User.remove({}),
    Question.remove({}),
    Answer.remove({})
  ])
  .then( ()=> done())
  .catch(done);
};
