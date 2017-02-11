'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:auth-router');
const User = require('../model/user.js');
const authRouter = module.exports = Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});
const mongoose = require('mongoose');
const passport = require('passport');

authRouter.post('/register', jsonParser, function(req, res, next){
  debug('POST: /register');

  debug('req.body', req.body);
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }


  let user = new User();

  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()});
  });
});

authRouter.post('/login', jsonParser, function(req, res, next){
  debug('POST: /login');

  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});
