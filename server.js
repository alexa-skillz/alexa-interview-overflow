'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('alexa-skillz:server');

const questionRouter = require('./router/question-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(questionRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
  console.log('up on port:', PORT);
});
