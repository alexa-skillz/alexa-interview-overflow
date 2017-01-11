'use strict';

const User = require('../../model/user.js');
const Profile = require('../../model/profile.js');
const Question = require('../../model/profile.js');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

module.exports = exports = {};

exports.removeUser = function(done) {
  User.remove({})
  .then( ()=> done())
  .catch(done);
};

exports.killAllDataBase = function(done) {
  Promise.all([
    User.remove({}),
    Question.remove({}),
    Profile.remove({})
  ])
  .then( ()=> done())
  .catch(done);
};
