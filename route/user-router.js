'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:user-router');
const User = require('../model/user.js');
const userRouter = module.exports = Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});
const mongoose = require('mongoose');
const passport = require('passport');

userRouter.get('/api/users', function(request, response, next) {
  debug('GET: /api/users');

  User.find(function(err, users) {
    if (err) {
      return next(err);
    }
    response.json(users);
  });
});

userRouter.get('/api/users/:user', function(request, response, next) {
  debug('GET: /api/users/:user');

  response.json(request.user);
});

userRouter.param('user', function(request, response, next, id) {
  var query = User.findById(id);

  query.exec(function(err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new Error('Not found.'));
    }

    request.user = user;
    return next();
  });
});
