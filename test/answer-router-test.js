'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const debug = require('debug')('alexa-skillz:answer-router-test');
const mongoose = require('mongoose');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');

const User = require('../model/user.js');
const Question = require('../model/question.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;


describe('Answer Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });
  after( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/question/:questionID/answer', function() {
    afterEach( done => {
      afterController.removeData(done);
    });
    describe('with a valid body', function() {
      beforeEach( done => {
        new User(mockData.exampleUser)
        .generatePasswordHash(mockData.exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          mockData.exampleQuestion.userID = this.tempUser._id;
          return new Question(mockData.exampleQuestion).save();
        })
        .then( question =>{
          this.tempQuestion = question;
          mockData.exampleAnswer.userID = this.tempUser._id;
          mockData.exampleAnswer.questionID = this.tempQuestion._id;
          done();
        })
        .catch(done);
      });
      it('should return an answer', done => {
        request.post(`${url}/api/question/${this.tempQuestion._id}/answer`)
        .send(mockData.exampleAnswer)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          console.log(res.body);
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal(mockData.exampleAnswer.content);
          expect(res.body.content).to.be.a('string');
          expect(res.body.votes).to.equal(0);
          done();
        });
      });
    });
    describe('with an invalid body', function() {
      beforeEach( done => {
        new User(mockData.exampleUser)
        .generatePasswordHash(mockData.exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          mockData.exampleQuestion.userID = this.tempUser._id;
          return new Question(mockData.exampleQuestion).save();
        })
        .then( question =>{
          this.tempQuestion = question;
          mockData.exampleAnswer.userID = this.tempUser._id;
          mockData.exampleAnswer.questionID = this.tempQuestion._id;
          done();
        })
        .catch(done);
      });
      it('should return an answer', done => {
        request.post(`${url}/api/question/${this.tempQuestion._id}/answer`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          console.log(res.body);
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
});
