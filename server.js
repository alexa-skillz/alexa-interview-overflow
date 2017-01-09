'use strict';

const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const debug = require('debug')('alexa-skillz:server');

const authRouter = require('./route/auth-router.js');
const questionRouter = require('./route/question-router.js');
const answerRouter = require('./route/answer-router.js');
const errors = require('./lib/error-middleware.js');

const app = express();

dotenv.load();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MLAB_MONGO_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(answerRouter);
app.use(questionRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
});

server.isRunning = true;
