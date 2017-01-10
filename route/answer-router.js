'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('question:answer');

const bearerAuth = require('../lib/bearer-middleware.js');
const Answer = require('../model/answer.js');
const Question = require('../model/question.js');

const answerRouter = module.exports = new Router();

// POST /question/:id/answer - Route for creating an answer
answerRouter.post('/api/question/:questionID/answer', bearerAuth, jsonParser, (request, response, next) => {
  debug('POST: /api/question/:questionID/answer');

  Question.findByIdAndAddAnswer(request.params.questionID, request.body)
  .then(answer => {
    debug(answer);
    return response.json(answer);
  })
  .catch(next);
});

// GET /answer/:id - Get a specific answer
answerRouter.get('/api/answer/:id', (request, response, next) => {
  debug('GET: /api/answer/:id');

  Answer.findById(request.params.id)
  .then(answer => response.json(answer))
  .catch(err => next(createError(404, err.message)));
});

// GET /answer/ - Get all answers
answerRouter.get('/api/answer', (request, response, next) => {
  debug('GET: /api/answer');

  Answer.find()
  .then(arrayOfAnswers => response.json(arrayOfAnswers.map(ele => ele._id)))
  .catch(next);
});

// PUT /answer/:id - Edit a specific answer
answerRouter.put('/api/answer/:id', bearerAuth, jsonParser, (request, response, next) => {
  debug('PUT: /api/answer/:id');

  Answer.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then(answer => response.json(answer))
  .catch(err => next(createError(404, err.message)));
});

// PUT /answer/:id - Delete a specific answer
answerRouter.delete('/api/answer/:id', bearerAuth, (request, response, next) => {
  debug('DELETE: /api/answer/:id');

  Question.findByIdAndRemoveAnswer(request.params.id)
  .then(() => response.status(204).send())
  .catch(err => next(createError(404, err.message)));
});

// TODO: POST /answer/:id/vote-up
// TODO: POST /answer/:id/vote-down
// Vote on a specific answer
// answerRouter.post('/api/question/:questionID/answer/:id/vote-:dir', jsonParser, (request, response, next) => {
//   debug('/api/question/:questionID/answer/:id/vote-:dir');
// });

// TODO: explore why we get a 200 null response when hitting route for a deleted answer
