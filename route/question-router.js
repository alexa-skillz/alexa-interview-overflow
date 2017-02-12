'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('alexa-skillz:question-router');
const User = require('../model/user.js');
const Question = require('../model/question.js');
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
//
// questionRouter.route("/questions/:question")
//   .get(function(req, res, next) {
//     Question.populate(req.question, {
//       path: "answers",
//     }).then(function(question) {
//       Answer.populate(req.question.answers, {
//         path: "author",
//         select: "username"
//       }).then(function(answers) {
//         res.json(question);
//       });
//     });
//   })
//   .delete(auth, function(req, res, next) {
//
//     // Answer.remove({ question: req.question }, function(err) {
//     //   if (err) {
//     //     return next(err);
//     //   }
//     //
//     //   req.question.remove(function(err) {
//     //     if (err) {
//     //       return next(err);
//     //     }
//     //
//     //     res.send("success");
//     //   });
//     // });
//   });
//
// questionRouter.route("/questions/:question/upvote")
//   .put(auth, function(req, res, next) {
//     req.question.upvote(req.payload, function(err, question) {
//       if (err) {
//         return next(err);
//       }
//
//       Question.populate(question, {
//         path: "author",
//         select: "username"
//       }).then(function(question) {
//         res.json(question);
//       });
//     });
//   });
//
// questionRouter.route("/questions/:question/downvote")
//   .put(auth, function(req, res, next) {
//     req.question.downvote(req.payload, function(err, question) {
//       if (err) {
//         return next(err);
//       }
//
//       Question.populate(question, {
//         path: "author",
//         select: "username"
//       }).then(function(question) {
//         res.json(question);
//       });
//     });
//   });
//
// questionRouter.param("question", function(req, res, next, id) {
//   var query = Question.findById(id);
//
//   query.exec(function(err, question) {
//     if (err) {
//       return next(err);
//     }
//
//     if (!question) {
//       return next(new Error("can't find question"));
//     }
//
//     req.question = question;
//     return next();
//   });
// });
