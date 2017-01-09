'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:answer-router');

const Question = require('../model/question.js');
const Answer = require('../model/answer.js');

// const questionRouter = require('question-router.js');

const bearerAuth = require('../lib/bearer-middleware');

const answerRouter = module.exports = new Router();
// const answerRouter = module.exports = Router();

// Abstracts questionID and error handling
answerRouter.param('questionID', function(req, res, next, questionID) {
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
answerRouter.param('answerID', function(req, res, next, id) {
  req.answer = req.question.answers.id(id);
  if(!req.answer) {
    err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  next();
});

// POST /api/questions/:questionID/answers/

answerRouter.post('/api/questions/:questionID/answers', jsonParser, function(req, res, next) {
  debug('POST: /api/questions/:questionID/answers');

  req.question.answers.push(req.body);
  req.question.save(function(err, question) {
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// // GET /questions/:questionID/answers/
// answerRouter.get('/api/questions/:questionID/answers', function(req, res, next) {
//   debug('GET: /api/questions/:questionID/answers');
//
//   Answer.find()
//   .sort({ created: -1 })
//   .then( arrayOfAnswers => res.json(arrayOfAnswers.map(answers => answers._id)) )
//   .catch(next);
// });
//
// // GET /questions/:questionID/answers/:answerID
// answerRouter.get('/api/questions/:questionID/answers/:answerID', function(req, res) {
//   debug('GET: /api/questions/:questionID/answers/:answerID');
//
//   res.json(req.question);
// });
//
// // PUT /questions/:questionID/answers/:answerID
// answerRouter.put('/api/questions/:questionID/answers/:answerID', bearerAuth, jsonParser, (req, res, next) => {
//   debug('PUT /api/questions/:questionID/answers/:answerID');
//
//   req.body.userID = req.user._id;
//   Answer.findByIdAndUpdate(req.answer.id, req.body, {new:true})
//   .then( answer => res.json(answer))
//   .catch(err => next(createError(404, err.message)));
// });
//
// // DELETE /questions/:questionID/answers/:answerID
// answerRouter.delete('/api/questions/:questionID/answers/:answerID', bearerAuth, (req, res, next) => {
//   debug('DELETE: /api/questions/:questionID/answers/:answerID');
//
//   Answer.findByIdAndRemove(req.answer.id)
//   .then( answer => {
//     if (answer.userID.toString() !== req.user._id.toString()) {
//       return next(createError(401, 'invalid user'));
//     }
//     res.status(204).send('deleted answer');
//   })
//   .catch(err => next(createError(404, err.message)));
// });
//
//
// // POST /questions/:questionID/answers/:answerID/upvote
//
//
// // POST /questions/:questionID/answers/:answerID/downvote
