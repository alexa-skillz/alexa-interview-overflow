'use strict';

const debug = require('debug')('alexa-skillz:fuzzy-regex');

module.exports = function(input){
  debug(`creating fuzzy regex from ${input}`);
  if (!input || typeof input !== 'string')
    return new RegExp('.*');
  let result = input.split('').join('.*');
  return new RegExp(`.*${result}.*`);
};
