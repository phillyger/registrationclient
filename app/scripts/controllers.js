'use strict';
angular.module('RegistrationClientApp.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, CommonFormService) {

    $scope.submitted = false;
    //$scope.password = '';


    $scope.submit = CommonFormService.submit();

    $scope.interacted = function (field) {
      console.log('interacted');
      return $scope.submitted || field.$dirty;
    };

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    },

      // Open the login modal
      $scope.login = function () {
        $scope.modal.show();
      };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    }
  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })

  .factory("CommonFormService", function ($http, $q, $log, URL_ENDPOINTS) {

    var isSubmitted = false;

    function init() {
      isSubmitted = false;
      return isSubmitted;
    }

    function submit() {
      isSubmitted = true;
      return isSubmitted;
    }

    function interacted(field) {
      return isSubmitted || field.$dirty;
    }

    function buildSecurityQuestionsList(questions, answers) {
      // an array of questions and answers
      var securityQuestions = [];

      // build array of dictionaries of Q&A.
      for (var i in questions) {
        var securityQuestionsDict = {};
        securityQuestionsDict['question'] = questions[i];
        securityQuestionsDict['answer'] = answers[i];

        // add dict to securityQuestions array
        securityQuestions.push(securityQuestionsDict);
      }

      return securityQuestions;
    }

    function allSecurityQuestions() {

      var deferred = $q.defer();
      $http.get(URL_ENDPOINTS.allQuestionsUrl)
        .success(function (data) {
          deferred.resolve({
            data: data.data
          });
        }).error(function (msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
      return deferred.promise;
    }

    return {
      init: init,
      submit: submit,
      interacted: interacted,
      allSecurityQuestions: allSecurityQuestions,
      buildSecurityQuestionsList: buildSecurityQuestionsList
    };
  });

