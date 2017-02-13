'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:answer-router');
const User = require('../model/user.js');
const Question = require('../model/question.js');
const Answer = require('../model/answer.js');
const answerRouter = module.exports = Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});
const mongoose = require('mongoose');
const passport = require('passport');

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

answerRouter.post('/api/questions/:question/answers', auth, jsonParser, function(req, res, next){
  let answer = new Answer(req.body);
  answer.question = req.question;
  answer.upvotes = 1;
  answer.usersWhoUpvoted.push(req.payload._id);

  answer.save(function(err, answer) {
    if (err) {
      return next(err);
    }

    req.question.answers.push(answer);
    req.question.save(function(err, question) {
      if (err) {
        return next(err);
      }

      Answer.populate(answer, {
        path: 'author',
        select: 'username'
      }).then(function(answer) {
        res.json(answer);
      });
    })
  })
});

answerRouter.put('/api/questions/:question/answers/:answer/upvote', auth, jsonParser, function(req, res, next){
  req.answer.upvote(req.payload, function(err, answer) {
    if (err) {
      return next(err);
    }

    Answer.populate(answer, {
      path: 'author',
      select: 'username'
    }).then(function(answer) {
      res.json(answer);
    });
  });
});

answerRouter.put('/api/questions/:question/answers/:answer/downvote', auth, jsonParser, function(req, res, next){
  req.answer.downvote(req.payload, function(err, answer) {
    if (err) {
      return next(err);
    }

    Answer.populate(answer, {
      path: 'author',
      select: 'username'
    }).then(function(answer) {
      res.json(answer);
    });
  });
});

answerRouter.param('question', function(req, res, next, id){
  let query = Question.findById(id);

  query.exec(function(err, question) {
    if (err) {
      return next(err);
    }

    if (!question) {
      return next(new Error('Question not found.'));
    }

    req.question = question;
    return next();
  });
});

answerRouter.param('answer', function(req, res, next, id){
  let query = Answer.findById(id);

  query.exec(function(err, answer) {
    if (err) {
      return next(err);
    }

    if (!answer) {
      return next(new Error('Answer not found.'));
    }

    req.answer = answer;
    return next();
  });
});

answerRouter.put('/api/answer/:id', auth, jsonParser, (request, response, next) => {
  debug('PUT: /api/answer/:id');

  Answer.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then(answer => response.json(answer))
  .catch(err => next(createError(404, err.message)));
});

answerRouter.delete('/api/answer/:id', auth, (request, response, next) => {
  debug('DELETE: /api/answer/:id');

  Question.findByIdAndRemoveAnswer(request.params.id)
  .then(() => response.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
