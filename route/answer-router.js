'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:answer-router');

const Question = require('../model/question.js');
const Answer = require('../model/answer.js');

const bearerAuth = require('../lib/bearer-middleware');

// const questionRouter = module.exports = new Router();
const answerRouter = module.exports = new Router();

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
    console.log('leaving');
    return next();
  });
});

// Abstracts answerID and error handling
answerRouter.param('answerID', function(req, res, next, answerID) {
  console.log('SEE ME?');
  req.answer = req.question.answer.answerID(answerID);
  // if(!req.answer) {
  //   err = new Error('Not Found');
  //   err.status = 404;
  //   return next(err);
  // }
  console.log('req.answer is', req.answer);
  next();
});

// POST /api/questions/:questionID/answers

// answerRouter.post('/api/questions/:questionID/answers', jsonParser, function(req, res, next) {
//   debug('POST: /api/questions/:questionID/answers');
//
//   req.question.answers.push(req.body);
//   // req.body.userID = req.user._id;
//   new Answer(req.body).save()
//   .then( answer => res.json(answer) )
//   .catch(next);
// });

answerRouter.post('/api/questions/:questionID/answers', jsonParser, function(req, res, next) {
  debug('POST: /api/questions/:questionID/answers');

  req.question.answers.push(req.body);
  // console.log('::: req.question.answers is:', req.question.answers);
  // console.log('::: answer is:', answer);
  req.question.save(function(err, question) {
    if(err) return next(err);
    res.status(201);
    console.log(':::', req.body);
    console.log(question);
    Question.findById(req.params.questionID, (err, q) => {
      res.json(q);
    });
    // console.log('::: question is:', question);
  });
});

// GET /questions/:questionID/answers/

answerRouter.get('/api/questions/:questionID/answers/:answerID', function(req, res) {
  console.log('::: req.question.answers is', req.question.answers);
  res.json(req.question.answers);
});

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


// KEEEP ME WORKS KINDA

// answerRouter.post('/api/questions/:questionID/answers', jsonParser, function(req, res, next) {
//   debug('POST: /api/questions/:questionID/answers');
//
//   req.question.answers.push(req.body);
//   req.question.save(function(err, question) {
//     if(err) return next(err);
//     res.status(201);
//     console.log(':::', req.body);
//     res.json(question);
//     console.log('::: question is:', question);
//   });
// });
