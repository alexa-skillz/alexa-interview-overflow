'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:question-router');

const Question = require('../model/question.js');
const bearerAuth = require('../lib/bearer-middleware.js');

const questionRouter = module.exports = new Router();

// Abstracts questionID and error handling
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

// Abstracts answerID and error handling
questionRouter.param('answerID', function(req, res, next, answerID) {
  console.log('SEE ME?');
  req.answer = req.question.answer.answerID(answerID);
  if(!req.answer) {
    err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  console.log('req.answer is', req.answer);
  next();
});

// POST api/questions - route for creating questions
questionRouter.post('/api/questions', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/questions');

  req.body.userID = req.user._id;
  new Question(req.body).save()
  .then( question => res.json(question) )
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
questionRouter.get('/api/questions/:questionID', function(req, res) {
  debug('GET: /api/questions/:questionID');

  res.json(req.question);
});

// PUT api/questions/:questionID - route to update a specific questionID
questionRouter.put('/api/questions/:questionID', bearerAuth, jsonParser, (req, res, next) => {
  debug('PUT: /api/questions/:questionID');

  req.body.userID = req.user._id;
  Question.findByIdAndUpdate(req.question.id, req.body, {new:true})
  .then( question => res.json(question))
  .catch(err => next(createError(404, err.message)));
});

// DELETE api/questions/:questionID - route to delete a specific questionID
questionRouter.delete('/api/questions/:questionID', bearerAuth, (req, res, next) => {
  debug('DELETE: /api/questions/:questionID');

  Question.findByIdAndRemove(req.question.id)
  .then( question => {
    if (question.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    }
    res.status(204).send('deleted question');
  })
  .catch(err => next(createError(404, err.message)));
});

// ANSWER ROUTES ----------------------------------------------------

questionRouter.post('/api/questions/:questionID/answers', jsonParser, function(req, res, next) {
  debug('POST: /api/questions/:questionID/answers');

  req.question.save(function(err, question) {
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
  req.question.answers.push(req.body);
});
