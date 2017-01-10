'use strict';

const User = require('../../model/user.js');


module.exports = exports = {};

exports.removeUser = function(done) {
  User.remove({})
  .then( ()=> done())
  .catch(done);
};
