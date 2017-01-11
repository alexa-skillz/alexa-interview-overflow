'use strict';

const User = require('../../model/user.js');
const mockData = require('./mock-data.js');

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
