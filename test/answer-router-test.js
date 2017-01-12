'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;


describe('Answer Routes', function() {
  before( done => serverToggle.serverOn(server, done));
  after( done => serverToggle.serverOff(server, done));
  before( done => beforeController.call(this, done));
  after( done => afterController.killAllDataBase(done));

  var testAnswer = '';

  describe('POST: /api/question/:questionID/answer', () => {
    describe('with a valid body', () => {
      it('should return an answer', done => {
        request.post(`${url}/api/question/${this.tempQuestion._id}/answer`)
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
          expect(res.body.votes).to.equal(0);
          done();
        });
      });
    });
    describe('with an invalid body', () => {
      it('should return an bad request', done => {
        request.post(`${url}/api/question/${this.tempQuestion._id}/answer`)
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
        request.post(`${url}/api/question/${this.tempQuestion._id}/answer`)
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
    describe('GET: /api/answer/:id', () => {
      describe('with a valid body', () => {
        it('should return an answer', done => {
          request.get(`${url}/api/answer/${testAnswer._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.content).to.equal(mockData.exampleAnswer.content);
            expect(res.body.content).to.be.a('string');
            done();
          });
        });
        it('should return all answers', done => {
          request.get(`${url}/api/answer`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
        });
      });
      describe('with an invalid body', () => {
        it('should return an invalid route', done => {
          request.get(`${url}/api/answer/invalid`)
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
    describe('PUT: /api/answer/:answerID', () => {
      describe('with a valid body', () => {
        it('should return a updated answer', done => {
          request.put(`${url}/api/answer/${testAnswer._id}`)
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
          request.put(`${url}/api/answer/invalid`)
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

    describe('DELETE: /api/answer/:id', () => {
      describe('with a valid request', () => {
        it('should delete an answer', done => {
          request.delete(`${url}/api/answer/${testAnswer._id}`)
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
          request.delete(`${url}/api/answer/invalid`)
          .set({
            Authorization: `Bearer ${this.tempToken}`
          })
          .end((err, res) => {
            expect(err).to.be.an('error');
            expect(res.status).to.equal(404);
            done();
          });
        });
        it('should return an unauthorized', done => {
          request.delete(`${url}/api/answer/${testAnswer._id}`)
          .end((err, res) => {
            expect(err).to.be.an('error');
            expect(res.status).to.equal(401);
            done();
          });
        });
      });
    });
  });
});
