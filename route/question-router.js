'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:question-router');
const Question = require('../model/question.js');
const Answer = require('../model/answer.js');
const User = require('../model/user.js');
const questionRouter = module.exports = new Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});

questionRouter.post('/api/question', auth, jsonParser, (request, response, next) => {
  debug('POST: /api/question');

  let question = new Question(request.body);
  question.usersWhoUpvoted.push(request.payload._id);

  question.save((err, question) => {
    if (err) {
      return next(err);
    }

    Question.populate(question, { path: 'author', select: 'username'})
    .then((question) => {
      response.json(question);
    })
    .catch(next);
  });
});

questionRouter.get('/api/question/:id', (request, response, next) => {
  debug('GET: /api/question/:id');

  Question.findById(request.params.id)
  .populate('answers')
  .then(question => response.json(question))
  .catch(err => next(createError(404, err.message)));
});

questionRouter.get('/api/question', (request, response, next) => {
  debug('GET: /api/question');

  Question.find((err, questions) => {
    if (err) {
      return next(err);
    }

    Question.populate(questions, { path: "author", select: "username"})
    .then((questions) => {
      response.json(questions);
    })
    .catch(next);
  });
});

questionRouter.put('/api/question/:id', auth, jsonParser, (request, response, next) => {
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

questionRouter.param('id', function(request, response, next, id) {
  var query = Question.findById(id);

  query.exec(function (err, question){
    if (err) { return next(err); }
    if (!question) { return next(new Error('can\'t find question')); }

    request.question = question;
    return next();
  });
});

questionRouter.put('/api/question/:id/upvote', auth, (request, response, next) => {
  debug('PUT: /api/question/:id/upvote');

  request.question.upvote(function(err, question){
    if (err) { return next(err); }

    response.json(question);
  });
});

questionRouter.put('/api/question/:id/downvote', auth, (request, response, next) => {
  debug('PUT: /api/question/:id/downvote');

  request.question.downvote(function(err, question){
    if (err) { return next(err); }

    response.json(question);
  });
});

questionRouter.delete('/api/question/:id', auth, (request, response, next) => {
  debug('DELETE: /api/question/:id');

  Question.findById(request.params.id)
  .then(question => {
    if(question.answersArray.length === 0) {
      return Question.findByIdAndRemove(question._id);
    }
    if(question.answersArray.length !== 0) {
      throw new Error();
    }
  })
  .then(() => response.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
