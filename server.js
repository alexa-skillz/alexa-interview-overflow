'use strict';

const express = require('express');
const app = express();
const cors = require('cors'); // eslint-disable-line
const morgan = require('morgan'); // eslint-disable-line
const jsonParser = require('body-parser').json;
const questionRouter = require('./router/question-router.js');
const debug = require('debug')('alexa-skillz:server');

app.use(jsonParser());

app.use(questionRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
  console.log('up on port:', PORT);
});
