'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  votes: { type: Number, default:0 }
});

answerSchema.method('update', function(updates, callback) {
  Object.assign(this, updates, {updated: new Date()});
  this.parent().save(callback);
});

answerSchema.method('vote', function(vote, callback) {
  if( vote === 'up') {
    this.votes += 1;
  } else {
    this.votes -= 1;
  }
  this.parent().save(callback);
});
