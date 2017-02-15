'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:answer-router');
const Question = require('../model/question.js');
const Answer = require('../model/answer.js');
const createError = require('http-errors');
const answerRouter = module.exports = Router();
const jwt = require('express-jwt');
const auth = jwt({secret: 'secret', userProperty: 'payload'});

answerRouter.get('/api/answers/', (request, response, next) => {
  debug('GET: /api/answers/');

  Answer.find()
  .then(arrayOfAnswers => response.json(arrayOfAnswers.map(ele => ele._id)))
  .catch(next);
});

answerRouter.post('/api/questions/:question/answers', auth, jsonParser, function(req, res, next){
  debug('POST: /api/questions/:question/answers');

  let answer = new Answer(req.body);
  answer.question = req.question;
  answer.upvotes = 1;
  answer.usersWhoUpvoted.push(req.payload._id);
  answer.author = req.payload._id;

  answer.save(function(err, answer) {
    if (err) {
      return next(err);
    }

    req.question.answers.push(answer);
    req.question.save(function(err) {
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
});

answerRouter.put('/api/questions/:question/answers/:answer/upvote', auth, jsonParser, function(req, res, next){
  debug('PUT: /api/questions/:question/answers/:answer/upvote');

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
  debug('PUT: /api/questions/:question/answers/:answer/downvote');

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

answerRouter.put('/api/questions/:question/answers/:answer', auth, jsonParser, (request, response, next) => {
  debug('PUT: /api/questions/:question/answers/:answer');
  console.log('PUT', request.answer.author);
  if (request.answer.author != request.payload._id) {
    response.statusCode = 401;
    return response.end('Invalid Authorization');
  }

  Answer.findByIdAndUpdate(request.answer, request.body, {new: true})
  .then( answer => {
    if(request.body.content === undefined) {
      return next(createError(400, 'invalid body'));
    }
    response.json(answer);
  })
  .catch(err => next(createError(500, err.message)));
});

answerRouter.delete('/api/questions/:question/answers/:answer', jsonParser, (req, res, next) => {
  debug('DELETE: /api/questions/:question/answers/:answer');
  
  Question.remove({ answer: req.answer }, function(err) {
    if (err) {
      return next(err);
    }

    req.question.answers.splice(req.question.answers.indexOf(req.answer), 1);
    req.question.save(function(err) {
      if (err) {
        return next(err);
      }
      req.answer.remove(function(err) {
        if (err) {
          return next(err);
        }
        res.statusCode = 204;
        res.send('success');
      });
    });
  });
});
