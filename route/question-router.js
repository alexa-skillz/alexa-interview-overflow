'use strict';

const Router = require('express').Router;

const debug = require('debug')('alexa-skillz:question-router');
// const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Question = require('../model/question.js');
const questionRouter = module.exports = Router();

questionRouter.param('questionID', function(req, res, next, questionID) {
  Question.findById(questionID, function(err, doc) {
    if(err) return next(err);
    if(!doc) {
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

// POST api/questions - route for creating questions
questionRouter.post('/api/questions', jsonParser, function(req, res, next) {
  debug('POST: /api/questions');

  new Question(req.body).save()
  .then( question => res.json(question))
  .catch(next);
});

// // GET api/questions/:questionID - route for a specific questionID
questionRouter.get('/api/questions/:questionID', function(req, res) {
  debug('GET: /api/questions/:questionID');

  res.json(req.question);
});
