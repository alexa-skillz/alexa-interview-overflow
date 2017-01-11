'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = Schema({
  created: { type: Date, default: Date.now },
  profileName: { type: String, unique: true },
  bio: { type:String },
  primaryLanguage: { type: String },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('profile', profileSchema);
