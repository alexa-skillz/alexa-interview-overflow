'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

describe.only('Question Routes', () => {
  before( done => serverToggle.serverOn(server, done));
  after( done => serverToggle.serverOff(server, done));
  before( done => beforeController.call(this, done));
  after( done => afterController.killAllDataBase(done));

  describe('POST: /api/question', () => {
    it('should return a questions with a 200 status', done => {
      request.post(`${url}/api/question`)
      .send(mockData.exampleQuestion)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.content).to.equal(mockData.exampleQuestion.content);
        expect(res.status).to.equal(200);
        done();
      });
    });
    describe('with no token provided', () => {
      it('should return a 401 status code', done => {
        request.post(`${url}/api/question`)
        .send(mockData.exampleQuestion)
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
        .end( res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET: /api/question/:id', () => {
    it('should return a question and a 200 status', done => {
      request.get(`${url}/api/question/${this.tempQuestion._id}`)
      .end((err,res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.userID).to.equal(mockData.exampleQuestion.userID.toString());
        expect(res.body.content).to.equal(mockData.exampleQuestion.content);
        done();
      });
    });
    it('should return a 404 err with unregistered routes', done => {
      request.get(`${url}/api/invalid/${this.tempQuestion._id}`)
      .end( res => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT: /api/question/:id', () => {
    it('should update a question', done => {
      request.put(`${url}/api/question/${this.tempQuestion._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(mockData.updatedQuestion)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(mockData.updatedQuestion.content);
        done();
      });
    });
    describe('when no authorization is sent', () => {
      it('should return a 401 error', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .send(mockData.updatedQuestion)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('when an invalid body is sent', () => {
      it('should return a 400', done => {
        var invalidUpdatedQuestion = {invalid: 'invalid updated question'};
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(invalidUpdatedQuestion)
        .end( res => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid route', () => {
      it('should return a 404 error', done => {
        request.put(`${url}/api/invalid_route/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(mockData.updatedQuestion)
        .end( res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with an invalid token', () => {
      it('should return a 500 error status', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}`)
        .set({
          Authorization: `Bearer ${this.invalidToken}`
        })
        .send(mockData.updatedQuestion)
        .end( res => {
          expect(res.status).to.equal(500);
          done();
        });
      });
    });
  });

  describe('PUT: /api/question/:id/upvote', () => {
    it('should upvote a question', done => {
      request.put(`${url}/api/question/${this.tempQuestion._id}/upvote`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(mockData.updatedVote)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.votes).to.equal(mockData.updatedVote.votes);
        done();
      });
    });
    describe('when no authorization is sent', () => {
      it('should return a 401 error', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}/upvote`)
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with an invalid route', () => {
      it('should return a 404 error', done => {
        request.put(`${url}/api/invalid_route/${this.tempQuestion._id}/upvoting`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with an invalid token', () => {
      it('should return a 401 error status - invalid token', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}/upvote`)
        .set({
          Authorization: `Bearer ${this.invalidToken}`
        })
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('PUT: /api/question/:id/downvote', () => {
    it('should downvote a question', done => {
      request.put(`${url}/api/question/${this.tempQuestion._id}/downvote`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(mockData.updatedVote)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.votes).to.equal(0);
        done();
      });
    });
    describe('when no authorization is sent', () => {
      it('should return a 401 error', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}/downvote`)
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with an invalid route', () => {
      it('should return a 404 error', done => {
        request.put(`${url}/api/invalid_route/${this.tempQuestion._id}/downvoting`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with an invalid token', () => {
      it('should return a 401 error status - invalid token', done => {
        request.put(`${url}/api/question/${this.tempQuestion._id}/downvote`)
        .set({
          Authorization: `Bearer ${this.invalidToken}`
        })
        .send(mockData.updatedVote)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/question/:id', () => {
    it('should delete a question', done => {
      request.delete(`${url}/api/question/${this.tempQuestion._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
