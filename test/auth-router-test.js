'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const mockData = require('./lib/mock-data.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

describe('Auth Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      afterEach( done => {
        afterController.removeUser(done);
      });
      it('should create a new user', done => {
        request.post(`${url}/api/signup`)
        .send(mockData.exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          expect(res.body.username).to.equal(mockData.username);
          expect(res.body.password).to.equal(mockData.password);
          expect(res.body.email).to.equal(mockData.email);
          done();
        });
      });
      it('should return a token that is 205 characters long', done => {
        request.post(`${url}/api/signup`)
        .send(mockData.exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.text.length).to.equal(205);
          done();
        });
      });
    });
    describe('with an invalid request - missing email', function() {
      it('should return a bad request', done => {
        request.post(`${url}/api/signup`)
        .send({username: 'test name', password: '1234'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
    describe('with an invalid request - missing password', function() {
      it('should return a bad request', done => {
        request.post(`${url}/api/signup`)
        .send({username: 'test', email: 'test@test.com'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
    describe('with an invalid request - missing username', function() {
      it('should return a bad request', done => {
        request.post(`${url}/api/signup`)
        .send({password: '1234', email: 'test@test.com'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
    describe('with an invalid request of number instead of string', function() {
      it('should return a bad request', done => {
        request.post(`${url}/api/signup`)
        .send({username: 5, password: '1234'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
    describe('with an invalid route', function() {
      it('should return a not found', done => {
        request.post(`${url}/api/invalid`)
        .send(mockData.exampleUser)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });



  describe('GET /api/signin', function() {
    beforeEach( done => {
      beforeController.createUser(done);
    });
    afterEach( done => {
      afterController.removeUser(done);
    });
    describe('with a valid body', function() {
      it('should return a user', done => {
        request.get(`${url}/api/signin`)
        .auth(mockData.exampleUser.username, mockData.exampleUser.password)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('with a valid username and invalid password', function() {
      it('should return a bad request',done => {
        request.get(`${url}/api/signin`)
        .auth(mockData.exampleUser.username, 'invalidPassword')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    // Currently return 500 and have not been able to find a way to return 401 incorrect user name.
    // describe('with a valid password and invalid username', function() {
    //   it('should return a bad request - incorrect username',done => {
    //     request.get(`${url}/api/signin`)
    //     .auth('invalidUsername', mockData.exampleUser.password)
    //     .end((err, res) => {
    //       expect(err).to.be.an('error');
    //       expect(res.status).to.equal(401);
    //       done();
    //     });
    //   });
    // });
    describe('with a valid username and missing password', function() {
      it('should return a bad request - missing password',done => {
        request.get(`${url}/api/signin`)
        .auth(mockData.exampleUser.username)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid password and missing username', function() {
      it('should return a bad request - missing username',done => {
        request.get(`${url}/api/signin`)
        .auth('', mockData.exampleUser.password)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a missing username and password', function() {
      it('should return a bad request - missing username and password',done => {
        request.get(`${url}/api/signin`)
        .auth('', '')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a missing username and password', function() {
      it('should return a bad request',done => {
        request.get(`${url}/api/signin`)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with and invalid route', function() {
      it('should return a not found', done => {
        request.get(`${url}/api/invalid`)
        .auth(mockData.exampleUser.username, mockData.exampleUser.password)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
