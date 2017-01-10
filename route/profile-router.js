'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('alexa-skillz:profile-router');

// const User = require('../model/user.js');
// const Answer = require('../model/answer.js');
// const Question = require('../model/question.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = Router();

profileRouter.param('profileID', function(req, res, next, profileID) {
  debug('profileID params');
  Profile.findById(profileID, (err, doc) => {
    if(err) return next(err);
    if(!doc) return next(createError(404, 'User not found'));

    req.profile = doc;
    return next();
  });
});

profileRouter.param('questionID', function(req, res, next, questionID) {
  debug('questionID params');
  Profile.findById(questionID, (err, doc) => {
    if(err) return next(err);
    if(!doc) return next(createError(404, 'Question not found'));

    req.questions = doc;
    return next();
  });
});

profileRouter.param('answerID', function(req, res, next, answerID) {
  debug('answerID params');
  Profile.findById(answerID, (err, doc) => {
    if(err) return next(err);
    if(!doc) return next(createError(404, 'Answer not found'));

    req.answers = doc;
    return next();
  });
});

profileRouter.get('/api/users/:profileID', function(req, res) {
  debug('GET: /api/users/:profileID');

  res.json(req.profile);
});

profileRouter.put('/api/users/:profileID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/users/:profileID');

  req.body.userID = req.user._id;
  Profile.findByIDAndUpdate(req.profile.id, req.body, {new: true})
  .then( profile => res.json(profile))
  .catch(err => next(createError(401, err.message)));
});

//Need to finish DELETE Routes
// profileRouter.delete('/api/users/:profileID', )


profileRouter.get('/api/users/:profileID/questions', function(req, res) {
  debug('GET: /api/users/:profileID/questions');

  res.json(req.profile.questions);
});

profileRouter.get('/api/users/:profileID/questions/:questionID', function(req, res) {
  debug('GET: /api/users/:profileID/questions/:questionID');

  res.json(req.profile.questions.id);
});

profileRouter.put('/api/users/:profileID/questions/:questionID', function(req, res, next) {
  debug('PUT: /api/users/:profileID/questions/:questionID');

  req.body.userID = req.user._id;
  Profile.findByIdAndUpdate(req.profile.id, req.body, {new: true})
  .then( question => res.json(question))
  .catch(err => next(createError(401, err.message)));
});

// profileRouter.delete('/api/users/:profileID/questions/:questionID', )

profileRouter.get('/api/users/:profileID/answers', function(req, res) {
  debug('GET: /api/users/:profileID/answers');

  res.json(req.profile.answers);
});

profileRouter.get('/api/users/:profileID/answers/:answerID', function(req, res) {
  debug('GET: /api/users/:profileID/answers/:answerID');

  res.json(req.answer.id);
});
