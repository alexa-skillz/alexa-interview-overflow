'use strict';

const debug = require('debug')('alexa-skillz:server-toggle');

module.exports = exports = {};

exports.serverOn = function(server, done) {
  if(!server.isRunning) {
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      debug('Server UP');
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done) {
  if(server.isRunning) {
    server.close( err => {
      if(err) return done(err);
      server.isRunning = false;
      debug('Server DOWN');
      done();
    });
    return;
  }
  done();
};
