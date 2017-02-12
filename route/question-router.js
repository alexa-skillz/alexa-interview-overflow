'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:question-router');
const User = require('../model/user.js');
const Question = require('../model/question.js');
const Answer = require('../model/answer.js');
const questionRouter = module.exports = Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});
const mongoose = require('mongoose');
const passport = require('passport');

questionRouter.get('/api/questions', function(req, res, next){
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
  let question = new Question(req.body);
  question.usersWhoUpvoted.push(req.payload._id);

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

questionRouter.get('/api/questions/:question', function(req, res, next){
  Question.populate(req.question, {
    path: "answers",
  }).then(function(question) {
    Answer.populate(req.question.answers, {
      path: "author",
      select: "username"
    }).then(function(answers) {
      res.json(question);
    });
  });
})

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
