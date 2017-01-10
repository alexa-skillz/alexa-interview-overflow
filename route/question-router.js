'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:question-router');

const Question = require('../model/question.js');

const bearerAuth = require('../lib/bearer-middleware.js');

const questionRouter = module.exports = new Router();

// POST api/questions - route for creating questions
questionRouter.post('/api/questions', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/questions');

  req.body.userID = req.user._id;
  new Question(req.body).save()
  .then( question => res.json(question))
  .catch(next);
});

// GET  api/questions - route for getting all questions in the questions collection
questionRouter.get('/api/questions', function(req, res, next) {
  debug('GET: /api/questions');

  Question.find()
  .sort({ created: -1 })
  .then( arrayOfQuestions => res.json(arrayOfQuestions.map(questions => questions._id)) )
  .catch(next);
});

// GET api/questions/:questionID - route for getting a specific questionID
questionRouter.get('/api/questions/:id', function(req, res, next) {
  debug('GET: /api/questions/:id');

  Question.findById(req.params.id)
  .then( questions => { res.json(questions); })
  .catch(err => next(createError(404, err.message)));
});

// PUT api/questions/:questionID - route to update a specific questionID
questionRouter.put('/api/questions/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/questions/:id');

  Question.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( question => res.json(question))
  .catch(err => next(createError(404, err.message)));
});

// DELETE api/questions/:questionID - route to delete a specific questionID
questionRouter.delete('/api/questions/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/questions/:id');

  Question.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send('deleted questions'))
  .catch(err => next(createError(404, err.message)));
});
