'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:answer');

const bearerAuth = require('../lib/bearer-middleware.js');
const Answer = require('../model/answer.js');
const Question = require('../model/question.js');

const answerRouter = module.exports = new Router();

answerRouter.post('/api/question/:questionID/answer', bearerAuth, jsonParser, (request, response, next) => {
  debug('POST: /api/question/:questionID/answer');

  Question.findByIdAndAddAnswer(request.params.questionID, request.body)
  .catch(err => next(createError(400, err.message)))
  .then(answer => {
    debug(answer);
    return response.json(answer);
  })
  .catch(next);
});

answerRouter.get('/api/answer/:id', (request, response, next) => {
  debug('GET: /api/answer/:id');

  Answer.findById(request.params.id)
  .then(answer => response.json(answer))
  .catch(err => next(createError(404, err.message)));
});

answerRouter.get('/api/answer', (request, response, next) => {
  debug('GET: /api/answer');

  Answer.find()
  .then(arrayOfAnswers => response.json(arrayOfAnswers.map(ele => ele._id)))
  .catch(next);
});

answerRouter.put('/api/answer/:id', bearerAuth, jsonParser, (request, response, next) => {
  debug('PUT: /api/answer/:id');

  Answer.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then(answer => response.json(answer))
  .catch(err => next(createError(404, err.message)));
});

answerRouter.delete('/api/answer/:id', bearerAuth, (request, response, next) => {
  debug('DELETE: /api/answer/:id');

  Question.findByIdAndRemoveAnswer(request.params.id)
  .then(() => response.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
