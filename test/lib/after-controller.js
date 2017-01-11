'use strict';

const User = require('../../model/user.js');

const Answer = require('../../model/answer.js');
const Profile = require('../../model/profile.js');
const Question = require('../../model/profile.js');
const mongoose = require('mongoose');


mongoose.Promise = Promise;

module.exports = exports = {};

exports.killAllDataBase = function(done) {
  Promise.all([
    User.remove({}),
    Question.remove({}),
    Profile.remove({}),
    Answer.remove({})
  ])
  .then( ()=> done())
  .catch(done);
};
