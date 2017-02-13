(function() {
  "use strict";

  var app = angular.module("interview-overflow.controllers.question", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("question", {
        parent: "root",
        url: "/questions/{id}",
        views: {
          "container@": {
            templateUrl: "partials/question",
            controller: "QuestionController"
          }
        },
        resolve: {
          question: [
            "$stateParams",
            "questionService",
            function($stateParams, questionService) {
              return questionService.get($stateParams.id);
            }
          ]
        }
      });
    }
  ]);

  app.controller("QuestionController", [
    "$scope",
    "questionService",
    "question",
    "authService",
    function($scope, questionService, question, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.question = question;

      $scope.shouldShowAddNewAnswerForm = false;

      function addAnswer() {
        if ($scope.body === '') {
          return;
        }

        questionService.addAnswer(question._id, {
          body: $scope.body,
          author: authService.currentUserId()
        }).success(function(answer) {
          $scope.question.answers.push(answer);
        });

        $scope.body = "";
        $scope.shouldShowAddNewAnswerForm = false;
      }

      function incrementUpvotes(answer) {
        questionService.upvoteAnswer(question, answer);
      }

      function incrementDownvotes(answer) {
        questionService.downvoteAnswer(question, answer);
      }

      function deleteAnswer(answer) {
        // TODO add modal confirmation
        questionService.deleteAnswer(question, answer)
          .success(function() {
            question.answers.splice(question.answers.indexOf(answer), 1);
          });
      }

      function getUpvoteColor(answer) {
        if (answer.upvoteHover || isUpvotedByCurrentUser(answer)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(answer) {
        if (answer.downvoteHover || isDownvotedByCurrentUser(answer)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(answer) {
        return answer.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(answer) {
        return answer.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewAnswerForm() {
        $scope.shouldShowAddNewAnswerForm = true;
      }

      function hideAddNewAnswerForm() {
        $scope.shouldShowAddNewAnswerForm = false;
        $scope.body = "";
      }

      function showDeleteAnswer(answer) {
        return answer.author._id == authService.currentUserId();
      }

      $scope.addAnswer = addAnswer;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.deleteAnswer = deleteAnswer;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewAnswerForm = showAddNewAnswerForm;
      $scope.hideAddNewAnswerForm = hideAddNewAnswerForm;
      $scope.showDeleteAnswer = showDeleteAnswer;
    }
  ]);
})();
