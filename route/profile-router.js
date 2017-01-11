'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('alexa-skillz:profile-router');

const User = require('../model/user.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = Router();

profileRouter.get('/api/profile/me', bearerAuth, function(request, response, next){
  debug('GET: /api/profile/me');

  User.findById(request.user._id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then((user) => {
    return new Profile(user).save();
  })
  .then(profile => response.json(profile))
  .catch(next);
});
