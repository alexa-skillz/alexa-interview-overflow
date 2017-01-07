'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRouter = require('./route/auth-router.js');
const debug = require('debug')('alexa-skillz:server');

const app = express();

dotenv.load();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MLAB_MONGO_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);

app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
});
