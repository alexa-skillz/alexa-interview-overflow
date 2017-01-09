'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('alexa-skillz:user-router');

const Profile = require('../model/profile.js');

const profileRouter = module.exports = Router();

profileRouter.param('profileID', function(req, res, next, profileID) {
  debug('profileID params');
  Profile.findById(profileID, (err, doc) => {
    if(err) return next(err);
    if(!doc) return next(createError(404, 'User not found'));

    req.profile = doc;
    debug('req.user', req.user);
    return next();
  });
});


profileRouter.get('/api/users/:profileID', function(req, res) {
  debug('GET: /api/users/:profileID');

  res.json(req.profile);
});
