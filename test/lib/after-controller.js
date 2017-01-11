'use strict';

const User = require('../../model/user.js');
const Question = require('../../model/question.js');
const Answer = require('../../model/answer.js');


module.exports = exports = {};

// exports.removeUser = function(done) {
//   User.remove({}),
//   Question.remove({})
//   Answer.revmove({});
//   .then( ()=> done())
//   .catch(done);
// };

exports.removeData = function(done) {
  Promise.all([
    User.remove({}),
    Question.remove({}),
    Answer.remove({})
  ])
  .then( () => done())
  .catch(done);
};
