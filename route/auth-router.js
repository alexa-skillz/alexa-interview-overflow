'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:auth-router');
const User = require('../model/user.js');
const authRouter = module.exports = Router();
const passport = require('passport');

authRouter.post('/register', jsonParser, function(req, res, next){
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

authRouter.get('/auth/twitter', passport.authenticate('twitter'));

authRouter.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: 'http://127.0.0.1:8080/#!/',
  failureRedirect: '/login'}),
  function( req, res ) {
    res.json(req.user);
    return res.redirect('http://127.0.0.1:8080/#!/');
  });

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: 'http://127.0.0.1:8080/#!/',
  failureRedirect: '/',
}));

authRouter.get('/auth/amazon', passport.authenticate('amazon', { scope: ['profile', 'postal_code'] })),
function(req, res) {
};

authRouter.get('/auth/amazon/callback', passport.authenticate('amazon', { failureRedirect: '/login' }),
  function(req, res) {
    // console.log('CALLBACK RESPONSE;', res);
    res.redirect('http://127.0.0.1:8080/#!/');
  });
