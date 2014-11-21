'use strict';

/**
 * @ngdoc function
 * @name registrationClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the registrationClientApp
 */
angular.module('RegistrationClientApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $state, AuthenticationService, CommonFormService) {
    $rootScope.authenticationError = false;

    $scope.submitted = false;
    //$scope.password = '';


    $scope.submit = CommonFormService.submit();

    $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };


    $scope.user = {
      username: null,
      password: null
    };

    $scope.login = function() {
      AuthenticationService.login($scope.user);
    };


    $scope.$on('event:auth-loginRequired', function(e, rejection) {
      $scope.loginModal.show();
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.username = null;
      $scope.password = null;
    });

    $scope.$on('event:auth-login-failed', function(e, outcome) {

      switch(outcome.code) {
        case "400003":
          $state.go('activate-error', {'outcome': JSON.stringify(outcome)});
          break;
        default:
          $rootScope.outcome = JSON.stringify(outcome);
          $state.transitionTo('login-error');
          break;
      }



    });

    $scope.$on('event:auth-logout-complete', function() {
      $state.go('app.home', {}, {reload: true, inherit: false});
    });

  });

