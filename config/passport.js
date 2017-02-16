var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var AmazonStrategy = require('passport-amazon').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');
var configAuth = require('./auth.js');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new TwitterStrategy({
  consumerKey: configAuth.twitterAuth.consumerKey,
  consumerSecret: configAuth.twitterAuth.consumerSecret,
  callbackURL: configAuth.twitterAuth.callbackURL,
},
function(token, tokenSecret, profile, done) {
  process.nextTick(function() {
    User.findOne({ 'twitter.id': profile.id }, function(err, user) {
      if (err)
        return done(err);
      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.twitter.id          = profile.id;
        newUser.twitter.token       = token;
        newUser.twitter.username    = profile.username;
        newUser.twitter.displayName = profile.displayName;
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));

passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL,
},
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'google.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

passport.use(new AmazonStrategy({
  clientID: configAuth.amazonAuth.clientID,
  clientSecret: configAuth.amazonAuth.clientSecret,
  callbackURL: configAuth.amazonAuth.callbackURL
},
function(token, refreshToken, profile, done) {
  process.nextTick(function() {
    User.findOne({ amazonId: profile.id }, function (err, user) {
      if (err)
        return done(err);
      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.amazon.id = profile.id;
        newUser.amazon.token = token;
        newUser.amazon.name = profile.displayName;
        newUser.amazon.email = profile.emails[0].value;
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  });
}));
