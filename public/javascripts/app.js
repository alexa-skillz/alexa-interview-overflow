(function() {
  "use strict";
  
  var app = angular.module("interview-overflow", [
    "interview-overflow.controllers.main",
    "interview-overflow.controllers.post",
    "interview-overflow.controllers.auth",
    "interview-overflow.controllers.nav",
    "interview-overflow.services.post",
    "interview-overflow.services.auth",
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state("root", {
        abstract: true,
        views: {
          "header": {
            templateUrl: "partials/header",
            controller: "NavController"
          }
        }
      });

      $urlRouterProvider.otherwise("home");
    }
  ]);
})();