'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');

const User = require('../model/user.js');
const Question = require('../model/question.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleQuestion = {
  content: 'example question'
};

describe('Question Routes', () => {

  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

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
      done();
    })
    .catch(done);
  });

  beforeEach( done => {
    exampleQuestion.userID = this.tempUser._id.toString();
    new Question(exampleQuestion).save()
    .then( question => {
      this.tempQuestion = question;
      done();
    })
    .catch(done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Question.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  // ------------------
  // POST /api/question
  // ------------------

  describe('POST: /api/question', () => {

    it('should return a questions with a 200 status', done => {
      request.post(`${url}/api/question`)
      .send(exampleQuestion)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.content).to.equal(exampleQuestion.content);
        expect(res.status).to.equal(200);
        done();
      });
    });

    describe('with no token provided', () => {
      it('should return a 401 status code', done => {
        request.post(`${url}/api/question`)
        .send(exampleQuestion)
        .set({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

    describe('with no body content provided', () => {
      it('should return a 400 status code', done => {
        request.post(`${url}/api/question`)
        .send({})
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .set('Content-type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

    describe('with an invalid body provided', () => {
      it('should return a 400 status code', done => {
        request.post(`${url}/api/question`)
        .send('beepbeep')
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .set('Content-type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

    describe('when given an unregistered route', () => {
      it('should return a 404 not found status', done => {
        request.post(`${url}/api/nonexistent`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

  });

  // -----------------
  // GET /api/question
  // -----------------

  describe('GET: /api/question', () => {

    it('should return a collection of questions with a 200 status', done => {
      request.get(`${url}/api/question`)
      .end((err,res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });

    describe('when given an unregistered route', () => {
      it('should return a 404 err with unregistered routes', done => {
        request.get(`${url}/api/invalid`)
        .end((err,res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  // ---------------------
  // GET /api/question/:id
  // ---------------------

  describe('GET: /api/question/:id', () => {

    it('should return a question and a 200 status', done => {
      request.get(`${url}/api/question/${this.tempQuestion._id}`)
      .end((err,res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.userID).to.equal(exampleQuestion.userID);
        expect(res.body.content).to.equal(exampleQuestion.content);
        done();
      });
    });

    it('should return a 404 err with unregistered routes', done => {
      request.get(`${url}/api/invalid/${this.tempQuestion._id}`)
      .end((err,res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

  });

  // ---------------------
  // PUT /api/question/:id
  // ---------------------

  describe('PUT: /api/question/:id', () => {

    it('should update a question', done => {
      var updatedQuestion = {content: 'updated question content'};
      request.put(`${url}/api/question/${this.tempQuestion._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(updatedQuestion)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(updatedQuestion.content);
        done();
      });
    });

    describe('when no authorization is sent', () => {
      it('should return a 401 error', done => {
        var updatedQuestion = {content: 'updated question content'};
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .send(updatedQuestion)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('when an invalid body is sent', () => {
      it('should return a 400', done => {
        var updatedQuestion = {invalid: 'invalid updated question'};
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(updatedQuestion)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an invalid route', () => {
      it('should return a 404 error', done => {
        var updatedQuestion = {content: 'updated question content'};
        request.put(`${url}/api/invalid_route/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(updatedQuestion)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with and invalid token', () => {
      it('should return a 500 error status', done => {
        var updatedQuestion = {content: 'updated question content'};
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.invalidToken}`
        })
        .send(updatedQuestion)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
      });
    });

  });
});
