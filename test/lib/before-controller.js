'use strict';

const User = require('../../model/user.js');
const mockData = require('./mock-data.js');
const Buffer = require('buffer').Buffer;
const rng = require(`${__dirname}/../../node_modules/crypto-browserify/rng.js`);

module.exports = exports = {};

exports.createUser = function(done) {
  let user = new User(mockData.exampleUser);
  user.generatePasswordHash(mockData.exampleUser.password)
  .then( user => user.save())
  .then( user => {
    this.tempUser = user;
    done();
  })
  .catch(done);
};

exports.generateFindHash = function(size, callback) {
  console.log('HHHHHHIIIIIIIITTTTTTTTT');
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)));
    } catch (err) { callback(err); }
  } else {
    return new Buffer(rng(size));
  }
};
