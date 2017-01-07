'use strict';

const express = require('express');
const debug = require('debug')('alexa-skillz:server');
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
  console.log('up on port:', PORT);
});
