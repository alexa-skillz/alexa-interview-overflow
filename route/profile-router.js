'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:profile-router');

const User = require('../model/user.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = Router();

profileRouter.get('/api/profile/me', function(request, response, next){
  debug('GET: /api/profile/me');

  User.findById(request.user._id)
  .then( user => Profile.findOne({userID: user._id}))
  .then( profile => {
    if(profile === null) return new Profile({userID: request.user._id}).save();
    return profile;
  })
  .then( profile => response.json(profile))
  .catch(next);
});

profileRouter.put('/api/profile/me', jsonParser, function(request, response, next) {
  debug('PUT: /api/profile/me');

  Profile.findOneAndUpdate({userID: request.user._id}, request.body, {new:true})
  .then( profile => response.json(profile))
  .catch(next);
});
