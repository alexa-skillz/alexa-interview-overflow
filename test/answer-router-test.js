'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

describe('Answer Routes', function() {
  before( done => serverToggle.serverOn(server, done));
  after( done => serverToggle.serverOff(server, done));
  before( done => beforeController.call(this, done));
  after( done => afterController.killAllDataBase(done));

  var testAnswer = '';

  describe('POST: /api/questions/:question/answers', () => {
    describe('with a valid body', () => {
      it('should return an answer', done => {
        request.post(`${url}/api/questions/${this.tempQuestion._id}/answers`)
        .send(mockData.exampleAnswer)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          testAnswer = res.body;
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal(mockData.exampleAnswer.content);
          expect(res.body.content).to.be.a('string');
          done();
        });
      });
    });
    describe('with an invalid body', () => {
      it('should return an bad request', done => {
        request.post(`${url}/api/questions/${this.tempQuestion._id}/answers`)
        .send('')
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with invalid token', () => {
      it('should return unauthorized', done => {
        request.post(`${url}/api/questions/${this.tempQuestion._id}/answers`)
        .send(mockData.exampleAnswer)
        .set({
          Authorization: 'Bearer '
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('PUT: /api/questions/:question/answers/:answer', () => {
      describe('with a valid body', () => {
        it('should return a updated answer', done => {
          request.put(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}`)
          .send({content: 'updated content'})
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.content).to.equal('updated content');
            expect(res.body.content).to.be.a('string');
            done();
          });
        });
      });
      describe('with an invalid request', () => {
        it('should return a bad request', done => {
          request.put(`${url}/api/question/${this.tempQuestion._id}/answers/${testAnswer._id}`)
          .send('')
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            expect(err).to.be.an('error');
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });

    describe('PUT: /api/questions/:question/answers/:answer/upvote', () => {
      it('should upvote a answer', done => {
        request.put(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}/upvote`)
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
          request.put(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}/upvote`)
          .send(mockData.updatedVote)
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
        });
      });
      describe('with an invalid route', () => {
        it('should return a 404 error', done => {
          request.put(`${url}/api/invalid_route/${testAnswer._id}/upvoting`)
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
    });

    describe('PUT: /api/questions/:question/answers/:answer/downvote', () => {
      it('should downvote a answer', done => {
        request.put(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}/downvote`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(mockData.updatedVote)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.downvotes).to.equal(1);
          done();
        });
      });
      describe('when no authorization is sent', () => {
        it('should return a 401 error', done => {
          request.put(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}/downvote`)
          .send(mockData.updatedVote)
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
        });
      });
      describe('with an invalid route', () => {
        it('should return a 404 error', done => {
          request.put(`${url}/api/invalid_route/${testAnswer._id}/downvoting`)
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
    });

    describe('DELETE: /api/questions/:question', () => {
      describe('Question Test', () => {
        it('shoud not delete the question', done => {
          request.delete(`${url}/api/questions/${this.tempQuestion._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
        });
      });
    });

    describe('DELETE: /api/questions/:question/answers/:answer', () => {
      describe('with a valid request', () => {
        it('should delete an answer', done => {
          request.delete(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(204);
            expect(res.body.content).to.be.empty;
            done();
          });
        });
      });
      describe('with an invalid request', () => {
        it('should return an invalid route', done => {
          request.delete(`${url}/api/questions/${this.tempQuestion._id}/answers/${testAnswer._id}/invalid`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            expect(err).to.be.an('error');
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
});
