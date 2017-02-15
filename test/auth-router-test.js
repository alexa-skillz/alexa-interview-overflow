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

describe('Auth Routes', function() {
  before( done => serverToggle.serverOn(server, done));
  after( done => serverToggle.serverOff(server, done));
  describe('POST: /register', function() {
    describe('POST with a valid body', function() {
      afterEach( done => afterController.killAllDataBase(done));
      it('should create a new user', done => {
        request.post(`${url}/register`)
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
        request.post(`${url}/register`)
        .send(mockData.exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.token.length).to.equal(205);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('with an invalid request - missing password', function() {
      it('should return a 400 BadRequestError - missing password', done => {
        request.post(`${url}/register`)
        .send({username: mockData.exampleUser.username})
        .end( res => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid request - missing username', function() {
      it('should return a 400 BadRequestError - missing username', done => {
        request.post(`${url}/register`)
        .send({password: mockData.exampleUser.password})
        .end( res => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid route', function() {
      it('should return a 404 - /api/invalid is not a route', done => {
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

  describe('GET /login', function() {
    beforeEach( done => beforeController.call(this,done));
    afterEach( done => afterController.killAllDataBase(done));
    describe('with a valid body', function() {
      it('should login and return a user', done => {
        request.post(`${url}/login`)
        .send(mockData.exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('with a valid username and invalid password', function() {
      it('should return a bad request - wrong password', done => {
        request.post(`${url}/login`)
        .send({username: mockData.exampleUser.username, password: 'wrongPassword'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid password and invalid username', function() {
      it('should return a bad request - incorrect username', done => {
        request.post(`${url}/login`)
        .send({username: 'wrongUsername', password: mockData.exampleUser.password})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid username and missing password', function() {
      it('should return a bad request - missing password', done => {
        request.post(`${url}/login`)
        .send({username: mockData.exampleUser.username})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a valid password and missing username', function() {
      it('should return a bad request - missing username', done => {
        request.post(`${url}/login`)
        .send({password: mockData.exampleUser.password})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a missing username and password', function() {
      it('should return a bad request - missing username and password', done => {
        request.post(`${url}/login`)
        .send({username: '', password: ''})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a missing username and password', function() {
      it('should return a bad request',done => {
        request.post(`${url}/login`)
        .send()
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with and invalid route', function() {
      it('should return a not found', done => {
        request.post(`${url}/api/invalid`)
        .send(mockData.exampleUser.username, mockData.exampleUser.password)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
