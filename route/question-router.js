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
    secret: 'secret',
    userProperty: 'payload'
  });

  router.route("/questions")
    .get(function(req, res, next) {
      Question.find(function(err, questions) {
        if (err) {
          return next(err);
        }

        Question.populate(questions, {
          path: "author",
          select: "username"
        }).then(function(questions) {
          res.json(questions);
        });
      });
    })
    .post(auth, function(req, res, next) {
      var question = new Question(req.body);
      question.upvotes = 1;
      question.usersWhoUpvoted.push(req.payload._id);

      question.save(function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
        });
      });
    });

  // TODO error handling on these populate promises
  router.route("/questions/:question")
    .get(function(req, res, next) {
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
    .delete(auth, function(req, res, next) {

      // Answer.remove({ question: req.question }, function(err) {
      //   if (err) {
      //     return next(err);
      //   }
      //
      //   req.question.remove(function(err) {
      //     if (err) {
      //       return next(err);
      //     }
      //
      //     res.send("success");
      //   });
      // });
    });

  router.route("/questions/:question/upvote")
    .put(auth, function(req, res, next) {
      req.question.upvote(req.payload, function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
        });
      });
    });

  router.route("/questions/:question/downvote")
    .put(auth, function(req, res, next) {
      req.question.downvote(req.payload, function(err, question) {
        if (err) {
          return next(err);
        }

        Question.populate(question, {
          path: "author",
          select: "username"
        }).then(function(question) {
          res.json(question);
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

  module.exports = router;
})();

// 'use strict';
//
// const Router = require('express').Router;
// const jsonParser = require('body-parser').json();
// const createError = require('http-errors');
// const debug = require('debug')('alexa-skillz:question-router');
// const Question = require('../model/question.js');
// const Answer = require('../model/answer.js');
// const User = require('../model/user.js');
// const questionRouter = module.exports = new Router();
// const jwt = require('express-jwt');
// const auth = jwt({secret: 'secret', userProperty: 'payload'});
//
// questionRouter.post('/api/question', auth, jsonParser, (request, response, next) => {
//   debug('POST: /api/question');
//
//   let question = new Question(request.body);
//   question.usersWhoUpvoted.push(request.payload._id);
//
//   question.save((err, question) => {
//     if (err) {
//       return next(err);
//     }
//
//     Question.populate(question, { path: 'author', select: 'username' })
//     .then((question) => {
//       response.json(question);
//     })
//     .catch(next);
//   });
// });
//
// questionRouter.get('/api/question/:id', (req, res, next) => {
//   debug('GET: /api/question/:id');
//
//   Question.populate(req.question, {
//           path: "answers",
//         }).then(function(question) {
//           Answer.populate(req.question.answers, {
//             path: "author",
//             select: "username"
//           }).then(function(answers) {
//             res.json(question);
//           });
//         });
// });
//
// questionRouter.get('/api/question', (request, response, next) => {
//   debug('GET: /api/question');
//
//   Question.find((err, questions) => {
//     if (err) {
//       return next(err);
//     }
//
//     Question.populate(questions, { path: 'author', select: 'username' })
//     .then((questions) => {
//       response.json(questions);
//     })
//     .catch(next);
//   });
// });
//
// questionRouter.put('/api/question/:id', auth, jsonParser, (request, response, next) => {
//   debug('PUT: /api/question/:id');
//
//   request.body.userID = request.user._id;
//   Question.findByIdAndUpdate(request.params.id, request.body, {new: true})
//   .then( question => {
//     if(request.body.content === undefined) {
//       return next(createError(400, 'invalid body'));
//     }
//     response.json(question);
//   })
//   .catch(err => next(createError(500, err.message)));
// });

// questionRouter.param('id', function(request, response, next, id) {
//   var query = Question.findById(id);
//
//   query.exec(function (err, question){
//     if (err) { return next(err); }
//     if (!question) { return next(new Error('can\'t find question')); }
//
//     request.question = question;
//     return next();
//   });
// });
//
// questionRouter.put('/api/question/:id/upvote', auth, jsonParser, (request, response, next) => {
//   debug('PUT: /api/question/:id/upvote');
//
//   request.question.upvote(function(err, question){
//     if (err) { return next(err); }
//
//     response.json(question);
//   });
// });
//
// questionRouter.put('/api/question/:id/downvote', auth, jsonParser, (request, response, next) => {
//   debug('PUT: /api/question/:id/downvote');
//
//   request.question.downvote(function(err, question){
//     if (err) { return next(err); }
//
//     response.json(question);
//   });
// });
//
// // TODO: Fix this.
// questionRouter.delete('/api/question/:id', auth, jsonParser, (request, response, next) => {
//   debug('DELETE: /api/question/:id');
//
//   if (request.question.author != request.payload._id) {
//     response.statusCode = 401;
//     return response.end("Invalid authorization.");
//   }
//
//   debug(question.author);
//
//
//   Answer.remove({ question: request.question }, function(err) {
//     if (err) {
//       return next(err);
//     }
//
//     request.question.remove(function(err) {
//       if (err) {
//         return next(err);
//       }
//       response.send("Question removed.");
//     });
//   });


  // Question.findById(request.params.id)
  // .then(question => {
  //   if(question.answersArray.length === 0) {
  //     return Question.findByIdAndRemove(question._id);
  //   }
  //   if(question.answersArray.length !== 0) {
  //     throw new Error();
  //   }
  // })
  // .then(() => response.status(204).send())
  // .catch(err => next(createError(404, err.message)));
// });
