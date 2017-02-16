'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, unique: true, lowercase: true },
  hash: String,
  salt: String,
  upvotedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
  downvotedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
  upvotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }],
  downvotedAnswers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }],
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'secret');
};

module.exports = mongoose.model('user', userSchema);
