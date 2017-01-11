'use strict';

const User = require('../../model/user.js');
const mockData = require('./mock-data.js');
const Question = require('../../model/question.js');

// module.exports = exports = {};
//
// exports.createUser = function(done) {
//   let user = new User(mockData.exampleUser);
//   user.generatePasswordHash(mockData.exampleUser.password)
//   .then( user => user.save())
//   .then( user => {
//     this.tempUser = user;
//     done();
//   })
//   .catch(done);
// };

module.exports = function(done) {
  let user = new User(mockData.exampleUser);
  user.generatePasswordHash(mockData.exampleUser.password)
  .then( user => user.save())
  .then( user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then( token => {
    this.tempToken = token;
    mockData.exampleQuestion.userID = this.tempUser._id;
    // testToken = this.tempToken;
    return new Question(mockData.exampleQuestion).save();
  })
  .then( question => {
    this.tempQuestion = question;
    mockData.exampleAnswer.userID = this.tempUser._id;
    mockData.exampleAnswer.questionID = this.tempQuestion._id;
    // testQuestion = this.tempQuestion;
    done();
  })
  .catch(done);
};
