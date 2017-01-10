'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const bearerAuth = require('../lib/bearer-middleware.js');
const debug = require('debug')('question:question-router');
const Question = require('../model/question.js');


const questionRouter = module.exports = new Router();

// POST /question - Route for creating questions
questionRouter.post('/api/question', bearerAuth, jsonParser, (request, response, next) => {
  debug('POST: /api/question');

  request.body.userID = request.user._id;
  new Question(request.body).save()
  .then(question => response.json(question))
  .catch(next);
});

// GET /question/:id - Route for specific questions
questionRouter.get('/api/question/:id', (request, response, next) => {
  debug('GET: /api/question/:id');

  Question.findById(request.params.id)
  .populate('answers')
  .then(question => response.json(question))
  .catch(next);
});

// GET /question - Route for questions collection
questionRouter.get('/api/question', (request, response, next) => {
  debug('GET: /api/question');

  Question.find()
  .then(arrayOfQuestions => response.json(arrayOfQuestions.map(ele => ele._id)))
  .catch(next);
});

// GET /question/:id - Route for updating a specific question
questionRouter.put('/api/question/:id', bearerAuth, jsonParser, (request, response, next) => {
  debug('PUT: /api/question/:id');

  request.body.userID = request.user._id;
  Question.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then(question => response.json(question))
  .catch(err => next(createError(400, err.message)));
});

// You can't delete a question, because other users probably add answer content
// And we do not want others to delete questions or their associated answers
// This is a business logic constraint
