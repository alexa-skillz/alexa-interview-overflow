(function() {
  "use strict";

  var app = angular.module("interview-overflow.services.question", []);

  app.factory("questionService", [
    "$http",
    "authService",
    function($http, authService) {
      var o = {
        questions: []
      };

      function getAll() {
        return $http.get("/questions").then(function(response) {
          angular.copy(response.data, o.questions);
        });
      }

      function get(id) {
        return $http.get("/questions/" + id).then(function(response) {
          return response.data;
        });
      }

      function create(question) {
        return $http.post("/questions", question, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(savedQuestion) {
          o.questions.push(savedQuestion);
        });
      }

      function deleteQuestion(question) {
        return $http.delete("/questions/" + question._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function() {
          o.questions.splice(o.questions.indexOf(question), 1);
        });
      }

      function upvote(question) {
        return $http.put("/questions/" + question._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedQuestion) {
          angular.copy(upvotedQuestion, question);
        });
      }

      function downvote(question) {
        return $http.put("/questions/" + question._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedQuestion) {
          angular.copy(downvotedQuestion, question);
        });
      }

      function addAnswer(id, answer) {
        return $http.post("/questions/" + id + "/answers", answer, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        });
      }

      function upvoteAnswer(question, answer) {
        return $http.put("/questions/" + question._id + "/answers/" + answer._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedAnswer) {
          // TODO should code like this be in the controller or the service?
          angular.copy(upvotedAnswer, answer);
        });
      }

      function downvoteAnswer(question, answer) {
        return $http.put("/questions/" + question._id + "/answers/" + answer._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedAnswer) {
          angular.copy(downvotedAnswer, answer);
        });
      }

      function deleteAnswer(question, answer) {
        return $http.delete("/questions/" + question._id + "/answers/" + answer._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        });
      }

      o.getAll = getAll;
      o.get = get;
      o.create = create;
      o.deleteQuestion = deleteQuestion;
      o.upvote = upvote;
      o.downvote = downvote;
      o.addAnswer = addAnswer;
      o.upvoteAnswer = upvoteAnswer;
      o.downvoteAnswer = downvoteAnswer;
      o.deleteAnswer = deleteAnswer;

      return o;
    }
  ]);
})();
