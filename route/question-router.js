'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:question-router');
const Question = require('../model/question.js');
const Answer = require('../model/answer.js');
const questionRouter = module.exports = Router();
const createError = require('http-errors');
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});

questionRouter.get('/api/questions', function(req, res, next){
  debug('GET: /api/questions');

  Question.find(function(err, questions) {
    if (err) {
      return next(err);
    }

    Question.populate(questions, {
      path: 'author',
      select: 'username'
    }).then(function(questions) {
      res.json(questions);
    });
  });
});

questionRouter.post('/api/questions', auth, jsonParser, function(req, res, next){
  debug('GET: /api/questions');

  let question = new Question(req.body);
  // question.usersWhoUpvoted.push(req.payload._id);
  question.upvotes = 1;

  question.save(function(err, question) {
    if (err) {
      return next(err);
    }

    Question.populate(question, {
      path: 'author',
      select: 'username'
    }).then(function(question) {
      res.json(question);
    });
  });
});

questionRouter.get('/api/questions/:question', function(req, res){
  debug('GET: /api/questions/:question');

  Question.populate(req.question, {
    path: 'answers',
  }).then(function(question) {
    Answer.populate(req.question.answers, {
      path: 'author',
      select: 'username'
    }).then(function() {
      res.json(question);
    });
  });
});

questionRouter.param('question', function(req, res, next, id){
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

questionRouter.put('/api/questions/:question/upvote', auth, jsonParser, function(req, res, next){
  debug('PUT: /api/questions/:question/upvote');

  req.question.upvote(req.payload, function(err, question) {
    if (err) {
      return next(err);
    }

    Question.populate(question, {
      path: 'author',
      select: 'username'
    }).then(function(question) {
      res.json(question);
    });
  });
});

questionRouter.put('/api/questions/:question/downvote', auth, jsonParser, function(req, res, next){
  debug('PUT: /api/questions/:question/downvote');

  req.question.downvote(req.payload, function(err, question) {
    if (err) {
      return next(err);
    }

    Question.populate(question, {
      path: 'author',
      select: 'username'
    }).then(function(question) {
      res.json(question);
    });
  });
});

questionRouter.put('/api/questions/:question', auth, jsonParser, (request, response, next) => {
  debug('PUT: /api/questions/:question');

  // if (request.question.author != request.payload._id) TODO: make this conditional work.
  // console.log(request.payload._id);
  // if (request.question.author != request.payload._id) {
  //   response.statusCode = 401;
  //   return response.end('Invalid Authorization');
  // }

  Question.findByIdAndUpdate(request.question, request.body, {new: true})
  .then( question => {
    if(request.body.content === undefined) {
      return next(createError(400, 'invalid body'));
    }
    response.json(question);
  })
  .catch(err => next(createError(500, err.message)));
});

questionRouter.delete('/api/questions/:question', auth, jsonParser, function(req, res, next){
  debug('DELETE: /api/questions/:question');

  // if (req.question.author != req.payload._id) TODO: Make this conditional work.
  // if (req.payload._id != req.payload._id) {
  //   res.statusCode = 401;
  //   return res.end('invalid authorization');
  // }

  if (req.question.answers.length !== 0) {
    throw new Error('forbidden');
  }

  Answer.remove({ question: req.question }, function(err) {
    if (err) {
      return next(err);
    }
    req.question.remove(function(err) {
      if (err) {
        return next(err);
      }
      res.statusCode = 204;
      res.send('success');
    });
  });
});
