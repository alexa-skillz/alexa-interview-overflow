(function() {
  "use strict";

  var app = angular.module("interview-overflow.controllers.main", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("home", {
        parent: "root",
        url: "/home",
        views: {
          "container@": {
            templateUrl: "partials/home",
            controller: "MainController"
          }
        },
        resolve: {
          getQuestionsPromise: [
            "questionService",
            function(questionService) {
              return questionService.getAll();
            }
          ]
        }
      });
    }
  ]);

  app.controller("MainController", [
    "$scope",
    "questionService",
    "authService",
    function($scope, questionService, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.questions = questionService.questions;

      $scope.shouldShowAddNewQuestionForm = false;

      function addQuestion() {
        if (!$scope.title || $scope.title === "") {
          return;
        }

        questionService.create({
          title: $scope.title,
          link: $scope.link,
          author: authService.currentUserId()
        });

        $scope.title = "";
        $scope.link = "";
        $scope.shouldShowAddNewQuestionForm = false;
      }

      function deleteQuestion(question) {
        // TODO add modal confirmation
        questionService.deleteQuestion(question);
      }

      function incrementUpvotes(question) {
        questionService.upvote(question);
      }

      function incrementDownvotes(question) {
        questionService.downvote(question);
      }

      function getUpvoteColor(question) {
        if (question.upvoteHover || isUpvotedByCurrentUser(question)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(question) {
        if (question.downvoteHover || isDownvotedByCurrentUser(question)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(question) {
        return question.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(question) {
        return question.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewQuestionForm() {
        $scope.shouldShowAddNewQuestionForm = true;
      }

      function hideAddNewQuestionForm() {
        $scope.shouldShowAddNewQuestionForm = false;
        $scope.title = "";
        $scope.link = "";
      }

      function showDeleteQuestion(question) {
        return question.author._id == authService.currentUserId();
      }

      $scope.addQuestion = addQuestion;
      $scope.deleteQuestion = deleteQuestion;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewQuestionForm = showAddNewQuestionForm;
      $scope.hideAddNewQuestionForm = hideAddNewQuestionForm;
      $scope.showDeleteQuestion = showDeleteQuestion
    }
  ]);
})();
