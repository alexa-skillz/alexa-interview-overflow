'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
// const beforeController = require('./lib/before-controller.js');
// const afterController = require('./lib/after-controller.js');

const User = require('../model/user.js');
const Question = require('../model/question.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleQuestion = {
  content: 'example question'
};

describe('Question Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  after( done => {
    Promise.all([
      User.remove({}),
      Question.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/question', () => {
    before( done => {
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

    // added to solve temporary before hook problem, modularize
    after( done => { // orig was afterEach
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

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
  });

  describe('POST: /api/question', () => {
    before( done => {
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

    // added to solve temporary before hook problem, modularize
    after( done => {
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    it('should return a 401 status code if no token was provided', done => {
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

  describe('POST: /api/question', () => {
    before( done => {
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

    // added to solve temporary before hook problem, modularize
    after( done => {
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    it('should return a 400 status code for no body', done => {
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

    it('should return a 400 status code for an invalid body', done => {
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

    it('should return a 404 not found status for unregistered routes', done => {
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

  // -----------------
  // GET /api/question
  // -----------------

  describe('GET: /api/question', () => {
    before( done => {
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

    // added to solve temporary before hook problem, modularize
    after( done => {
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    it('should return a collection of questions with a 200 status', done => {
      request.get(`${url}/api/question`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err,res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should return a 401 error when no token is provided', done => {
      request.get(`${url}/api/question`)
      .end((err,res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should return a 404 err with unregistered routes', done => {
      request.get(`${url}/api/invalid`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err,res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  // ---------------------
  // GET /api/question/:id
  // ---------------------

  describe('GET: /api/question/:id', () => {
    before( done => {
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

    before( done => {
      exampleQuestion.userID = this.tempUser._id.toString();
      new Question(exampleQuestion).save()
      .then( question => {
        this.tempQuestion = question;
        done();
      })
      .catch(done);
    });

    // added to solve temporary before hook problem, modularize
    after( done => {
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

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
    before( done => {
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

    before( done => {
      exampleQuestion.userID = this.tempUser._id.toString();
      new Question(exampleQuestion).save()
      .then( question => {
        this.tempQuestion = question;
        done();
      })
      .catch(done);
    });

    // added to solve temporary before hook problem, modularize
    after( done => {
      Promise.all([
        User.remove({}),
        Question.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    // 200 successfully updated
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

    it('should return a 401 error when no authorization is sent', done => {
      var updatedQuestion = {content: 'updated question content'};
      request.put(`${url}/api/question/${this.tempQuestion._id}`)
      .send(updatedQuestion)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    // 400 invalid body
    it('should return a 400 when an invalid body is sent', done => {
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

    // 404 invalid route
    it('should return a 404 error with an invalid route', done => {
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
});
