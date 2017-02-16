'use strict';

const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const debug = require('debug')('alexa-skillz:server');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./model/user.js');

const authRouter = require('./route/auth-router.js');
const answerRouter = require('./route/answer-router.js');
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

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(null, user);
  });
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(answerRouter);
app.use(userRouter);
app.use(questionRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server is up at port: ${PORT}`);
});

server.isRunning = true;
