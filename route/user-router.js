(function() {
  "use strict";

  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var User = mongoose.model("user");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: 'secret',
    userProperty: 'payload'
  });

  router.route("/users")
    .get(function(request, response, next) {
      User.find(function(err, users) {
        if (err) {
          return next(err);
        }

        response.json(users);
      });
    });

  router.route("/users/:user")
    .get(function(request, response, next) {
      response.json(request.user);
    });

  router.param("user", function(request, response, next, id) {
    var query = User.findById(id);

    query.exec(function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new Error("can't find user"));
      }

      request.user = user;
      return next();
    });
  });

  module.exports = router;
})();
