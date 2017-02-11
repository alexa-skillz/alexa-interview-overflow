'use strict';

const User = require('../../model/user.js');
const mockData = require('./mock-data.js');
const Question = require('../../model/question.js');

module.exports = function(done) {
  let user = new User();
  user.username = mockData.exampleUser.username;
  user.setPassword(mockData.exampleUser.password);

  user.save()
  .then( user => {
    this.tempUser = user;
    return user.generateJWT();
  })
  .then( token => {
    this.tempToken = token;
    mockData.exampleQuestion.userID = this.tempUser._id;
    return new Question(mockData.exampleQuestion).save();
  })
  .then( question => {
    this.tempQuestion = question;
    mockData.exampleAnswer.userID = this.tempUser._id;
    mockData.exampleAnswer.questionID = this.tempQuestion._id;
    done();
  })
  .catch(done);
};
