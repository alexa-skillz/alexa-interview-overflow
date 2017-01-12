'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const serverToggle = require('./lib/server-toggle.js');
const afterController = require('./lib/after-controller.js');
const beforeController = require('./lib/before-controller.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

describe('Profile Routes', function() {
  before( done => serverToggle.serverOn(server, done));
  after( done => serverToggle.serverOff(server, done));
  before( done => beforeController.call(this, done));
  after( done => afterController.killAllDataBase(done));

  describe('GET: /api/profile/me', () => {
    describe('Valid Body', () => {
      it('should return a profile with date created and userID', done => {
        request.get(`${url}/api/profile/me`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.text).to.be.a('string');
          expect(res.status).to.equal(200);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
      it('should return a profile with date created and userID', done => {
        request.get(`${url}/api/profile/me`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.text).to.be.a('string');
          expect(res.status).to.equal(200);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });
    describe('Invalid Body', () => {
      it('should return a BadRequest - no Authorization', done => {
        request.get(`${url}/api/profile/me`)
        .set({})
        .end(res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT: /api/profile/me', () => {
    describe('Valid Body', () => {
      it('should return an updated user profile', done => {
        var updated = { bio:'Updated Name', primaryLanguage:'updated description', profileName:'Updated ProfileName', availableForHire: true };
        request.put(`${url}/api/profile/me`)
          .send(updated)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.bio).to.equal(updated.bio);
            expect(res.body.primaryLanguage).to.equal(updated.primaryLanguage);
            expect(res.body.profileName).to.equal(updated.profileName);
            done();
          });
      });
    });
    describe('Invalid Body', () => {
      it('should return a BadRequest - no Authorization', done => {
        var updated = { availableForHire: 5 };
        request.put(`${url}/api/profile/me`)
          .send(updated)
          .set({})
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
  });
});
