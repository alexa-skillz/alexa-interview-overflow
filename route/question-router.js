'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('question:question-router');
const Question = require('../model/question.js');


const questionRouter = module.exports = new Router();

questionRouter.post('/api/question', bearerAuth, jsonParser, (request, response, next) => {
  debug('POST: /api/question');

  request.body.userID = request.user._id;
  new Question(request.body).save()
  .then(question => response.json(question))
  .catch(next);
});

questionRouter.get('/api/question/:id', (request, response, next) => {
  debug('GET: /api/question/:id');

  Question.findById(request.params.id)
  .populate('answers')
  .then(question => response.json(question))
  .catch(next);
});

questionRouter.get('/api/question', (request, response, next) => {
  debug('GET: /api/question');

  Question.find()
  .then(arrayOfQuestions => response.json(arrayOfQuestions.map(ele => ele._id)))
  .catch(next);
});

questionRouter.put('/api/question/:id', bearerAuth, jsonParser, (request, response, next) => {
  debug('PUT: /api/question/:id');

  request.body.userID = request.user._id;
  Question.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then( question => {
    if(request.body.content === undefined) {
      return next(createError(400, 'invalid body'));
    }
    response.json(question);
  })
  .catch(err => next(createError(500, err.message)));
});

questionRouter.delete('/api/question/:id', bearerAuth, (request, response, next) => {
  debug('DELETE: /api/question/:id');

  Question.findByIdAndRemove(request.params.id)
  .then(() => response.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
