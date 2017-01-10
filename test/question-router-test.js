'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const User = require('../model/user.js');
const Question = require('../model/question.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleQuestion = {
  content: 'test question'
};

describe('Question Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Question.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/question', () => {
    // before( done => {
    //   new User(exampleUser)
    //   .generatePasswordHash(exampleUser.password)
    //   .then( user => user.save())
    //   .then( user => {
    //     this.tempUser = user;
    //     return user.generateToken();
    //   })
    //   .then( token => {
    //     this.tempToken = token;
    //     done();
    //   })
    //   .catch(done);
    // });

    it('should return a questions with a 200 status', done => {
      request.post(`${url}/api/question`)
      .send(exampleQuestion)
      // .set({
      //   Authorization: `Bearer ${this.tempToken}`
      // })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.content).to.equal(exampleQuestion.content);
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST: /api/question', () => {
    // before( done => {
    //   new User(exampleUser)
    //   .generatePasswordHash(exampleUser.password)
    //   .then( user => user.save())
    //   .then( user => {
    //     this.tempUser = user;
    //     return user.generateToken();
    //   })
    //   .then( token => {
    //     this.tempToken = token;
    //     done();
    //   })
    //   .catch(done);
    // });

    // it('should return a 401 status code if no token was provided', done => {
    //   request.post(`${url}/api/question`)
    //   .send(exampleQuestion)
    //   .set({})
    //   .end((err, res) => {
    //     expect(res.status).to.equal(401);
    //     expect(err).to.be.an('error');
    //     done();
    //   });
    // });
  });

  describe('POST: /api/question', () => {
    // before( done => {
    //   new User(exampleUser)
    //   .generatePasswordHash(exampleUser.password)
    //   .then( user => user.save())
    //   .then( user => {
    //     this.tempUser = user;
    //     return user.generateToken();
    //   })
    //   .then( token => {
    //     this.tempToken = token;
    //     done();
    //   })
    //   .catch(done);
    // });

    it('should return a 400 status code for no body', done => {
      request.post(`${url}/api/question`)
      .send({})
      // .set({
      //   Authorization: `Bearer ${this.tempToken}`,
      // })
      .set('Content-type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err).to.be.an('error');
        done();
      });
    });

    it('should return a 400 status code for an invalid body', done => {
      request.post(`${url}/api/question`)
      .send('beepbeep')
      // .set({
      //   Authorization: `Bearer ${this.tempToken}`,
      // })
      .set('Content-type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err).to.be.an('error');
        done();
      });
    });

    it('should return a 404 not found status for unregistered routes', done => {
      request.post(`${url}/api/nonexistent`)
      // .set({
      //   Authorization: `Bearer ${this.tempToken}`
      // })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.be.an('error');
        done();
      });
    });
  });
});
