(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  const Answer = require('../model/answer.js');
  const Question = require('../model/question.js');
  const User = require('../model/user.js');

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "secret",
    userProperty: "payload"
  });

  router.route("/questions/:question/answers")
    .post(auth, function(req, res, next) {
      var answer = new Answer(req.body);
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
            path: "author",
            select: "username"
          }).then(function(answer) {
            res.json(answer);
          });
        })
      })
    });

  router.route("/questions/:question/answers/:answer")
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.answer.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO better way to handle this?
      req.question.answers.splice(req.question.answers.indexOf(req.answer), 1);
      req.question.save(function(err, question) {
        if (err) {
          return next(err);
        }

        req.answer.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

  router.route("/questions/:question/answers/:answer/upvote")
    .put(auth, function(req, res, next) {
      req.answer.upvote(req.payload, function(err, answer) {
        if (err) {
          return next(err);
        }

        Answer.populate(answer, {
          path: "author",
          select: "username"
        }).then(function(answer) {
          res.json(answer);
        });
      });
    });

  router.route("/questions/:question/answers/:answer/downvote")
    .put(auth, function(req, res, next) {
      req.answer.downvote(req.payload, function(err, answer) {
        if (err) {
          return next(err);
        }

        Answer.populate(answer, {
          path: "author",
          select: "username"
        }).then(function(answer) {
          res.json(answer);
        });
      });
    });

  router.param("question", function(req, res, next, id) {
    var query = Question.findById(id);

    query.exec(function(err, question) {
      if (err) {
        return next(err);
      }

      if (!question) {
        return next(new Error("can't find question"));
      }

      req.question = question;
      return next();
    });
  });

  router.param("answer", function(req, res, next, id) {
    var query = Answer.findById(id);

    query.exec(function(err, answer) {
      if (err) {
        return next(err);
      }

      if (!answer) {
        return next(new Error("can't find answer"));
      }

      req.answer = answer;
      return next();
    });
  });

  module.exports = router;
})();

// 'use strict';
//
// const Router = require('express').Router;
// const jsonParser = require('body-parser').json();
// const createError = require('http-errors');
// const debug = require('debug')('alexa-skillz:answer');
//
// const Answer = require('../model/answer.js');
// const Question = require('../model/question.js');
// const User = require('../model/user.js');
//
// const jwt = require('express-jwt');
// const auth = jwt({secret: 'secret', userProperty: 'payload'});
// const answerRouter = module.exports = new Router();
//
// answerRouter.post('/api/question/:questionID/answer', auth, jsonParser, (req, res, next) => {
//   debug('POST: /api/question/:questionID/answer');
//
//   var answer = new Answer(req.body);
//   answer.question = req.question;
//   answer.usersWhoUpvoted.push(req.payload._id);
//
//   answer.save(function(err, answer) {
//     if (err) {
//      return next(err);
//    }
//
//   req.question.answers.push(answer);
//
//   req.question.save(function(err, question) {
//     if (err) {
//       return next(err);
//     }
//
//     Answer.populate(answer, {
//       path: 'author',
//       select: 'username'
//     })
//     .then(function(answer) { res.json(answer); });
//   });
// });
// });
//
// answerRouter.get('/api/answer/:id', (request, response, next) => {
//   debug('GET: /api/answer/:id');
//
//   Answer.findById(request.params.id)
//   .then(answer => response.json(answer))
//   .catch(err => next(createError(404, err.message)));
// });
//
// answerRouter.get('/api/answer', (request, response, next) => {
//   debug('GET: /api/answer');
//
//   Answer.find()
//   .then(arrayOfAnswers => response.json(arrayOfAnswers.map(ele => ele._id)))
//   .catch(next);
// });
//
// answerRouter.put('/api/answer/:id', jsonParser, (request, response, next) => {
//   debug('PUT: /api/answer/:id');
//
//   Answer.findByIdAndUpdate(request.params.id, request.body, {new: true})
//   .then(answer => response.json(answer))
//   .catch(err => next(createError(404, err.message)));
// });
//
// answerRouter.delete('/api/answer/:id', (request, response, next) => {
//   debug('DELETE: /api/answer/:id');
//
//   Question.findByIdAndRemoveAnswer(request.params.id)
//   .then(() => response.status(204).send())
//   .catch(err => next(createError(404, err.message)));
// });
//
// answerRouter.param('id', function(request, response, next, id) {
//   var query = Answer.findById(id);
//
//   query.exec(function (err, answer){
//     if (err) { return next(err); }
//     if (!answer) { return next(new Error('can\'t find answer')); }
//
//     request.answer = answer;
//     return next();
//   });
// });
//
// answerRouter.put('/api/answer/:id/upvote', (request, response, next) => {
//   debug('PUT: /api/answer/:id/upvote');
//
//   request.answer.upvote(function(err, answer){
//     if (err) { return next(err); }
//     response.json(answer);
//   });
// });
//
// answerRouter.put('/api/answer/:id/downvote', (request, response, next) => {
//   debug('PUT: /api/answer/:id/downvote');
//
//   request.answer.downvote(function(err, answer){
//     if (err) { return next(err); }
//     response.json(answer);
//   });
// });
