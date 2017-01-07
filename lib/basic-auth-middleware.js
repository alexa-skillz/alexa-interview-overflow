'use strict';

const createError = require('http-errors');
const debug = require('debug')('alexa-skillz:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('basicAuth');

  let authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(401, 'authorization required'));

  let base64str = authHeader.split('Basic ')[1];
  if(!base64str) return next(createError(401, 'Username and Password required'));

  let utf8str = new Buffer(base64str, 'base64').toString();
  let authArr = utf8str.split(':');

  req.auth = {
    username: authArr[0],
    password: authArr[1]
  };

  if(!req.auth.username) return next(createError(401, 'Username required'));
  if(!req.auth.password) return next(createError(401, 'Password required'));
  next();
};
