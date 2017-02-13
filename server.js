'use strict';

const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const debug = require('debug')('alexa-skillz:server');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const authRouter = require('./route/auth-router.js');
const answerRouter = require('./route/answer-router.js');
const profileRouter = require('./route/profile-router.js');
const userRouter = require('./route/user-router.js');
const questionRouter = require('./route/question-router.js');
const errors = require('./lib/error-middleware.js');

const passport = require('passport');
require('./config/passport');

require('./model/answer');
require('./model/question');
require('./model/user');

const app = express();

if(process.env.NODE_ENV !== 'production') dotenv.load();

const PORT = process.env.PORT || 3000;

// View frontend - temporary
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(answerRouter);
app.use(profileRouter);
app.use(userRouter);
app.use(questionRouter);
app.use(express.static('public'));
app.use(passport.initialize());
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
});

server.isRunning = true;
