'use strict';

const Router = require('express').Router;
// const jsonParser = require('body-parser');
// const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('alexa-skillz:profile-router');

// const User = require('../model/user.js');
// const Question = require('../model/question.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = Router();

profileRouter.get('/api/profile/me', bearerAuth, function(request, response, next) {
  debug('GET: /api/users/me');

  Profile.findById(request.params.id)
  .then(profile => response.json(profile))
  .catch(next);
});
