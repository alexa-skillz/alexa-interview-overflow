'use strict';

const Router = require('express').Router;

const debug = require('debug')('alexa-skillz:question-router');
// const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Question = require('../model/question.js');
const questionRouter = module.exports = Router();


// POST /questions - route for creating questions
questionRouter.post('/api/questions', jsonParser, function(req, res, next) {
  debug('POST: /api/questions');

  new Question(req.body).save()
  .then( question => res.json(question))
  .catch(next);
});
