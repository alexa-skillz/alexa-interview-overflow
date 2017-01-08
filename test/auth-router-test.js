'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

const serverToggle = require('./lib/server-toggle.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'examplename',
  password: '1234',
  email: 'test@test.com'
};

describe('Auth Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      after( done => {
        User.remove({})
        .then( ()=> done())
        .catch(done);
      });
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('with an invalid request', function() {
      it('should return a bad request', done => {
        request.post(`${url}/api/signup`)
        .send({username: 'test name', password: '1234'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid route', function() {
      it('should return a not found', done => {
        request.post(`${url}/api/invalid`)
        .send(exampleUser)
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
      let user = new User(exampleUser);
      user.generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });
    afterEach( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });
    describe('with a valid body', function() {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('examplename', '1234')
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('with an invalid request', function() {
      it('should return a bad request',done => {
        request.get(`${url}/api/signin`)
        .auth('examplename', '1111')
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
        .auth('examplename', '1234')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
