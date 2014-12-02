'use strict';

/**
 * @ngdoc function
 * @name registrationClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the registrationClientApp
 */
angular.module('RegistrationClientApp')
  .controller('PasswordCtrl', function ($scope, $stateParams, $q, $state, PasswordSrv, UserInfoFactory, CommonFormService) {
    $scope.available = true;

    // determine hide/show of nested forms.
    $scope.showAccountValidationForm=true;
    $scope.showAccountSecurityQuestionsForm = false;
    $scope.showAccountPasswordResetForm = false;

    $scope.isAuthenticated = false;
    $scope.model = null;
    $scope.username = $stateParams.username;
    $scope.submitted = false;

    $scope.submit = CommonFormService.submit();

    //$scope.interacted = function(field) {
    //  CommonFormService.interacted(field);
    //}


    $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };

    //$scope.firstName = $stateParams.firstName;

    $scope.passwordChange = function () {
      // save data

      PasswordSrv.change({

        newPassword: $scope.model.newPassword,
        oldPassword: $scope.model.oldPassword,
        username: $scope.model.username
      });
    };



    var fetchQuestions = function (username) {

      var defer = $q.defer();

      if (username && username.length > 0) {
        PasswordSrv.questions.get({'username': username},
          function (successResponse) {
            if (successResponse) {
              console.log('fetchQuestions:success');
              $scope.question_1 = successResponse.data.question1;
              $scope.question_2 = successResponse.data.question2;
              $scope.question_3 = successResponse.data.question3;

              defer.resolve(true);
            }
          },
          function (errorResponse) {
            console.log('fetchQuestions:error');
            $scope.error = "Unable to fetch questions! " + errorResponse.outcome;
            defer.reject(false);
          }
        );
      }
      return defer.promise;
    };





    var isUserNameAvailable = function (username) {

      console.log('Running isUserNameAvailable...');
      var defer = $q.defer();

      if (username && username.length > 0) {
        PasswordSrv.available.get({'email': username},
          function (successResponse) {
            if (successResponse) {
              $scope.available = successResponse.data.available;
              $scope.showAccountSecurityQuestionsForm = true;
              $scope.showAccountValidationForm = false;

              // if available returns true, no matching username found -> reject.
              return successResponse.data.available ? defer.reject('Username not found') : defer.resolve('Username found');

            }
          },
          function (errorResponse) {
            console.log('isLoginAvailable:error');
            $scope.error = "Unable to check for availablility! " + errorResponse.outcome.message;

            defer.reject();
          }
        );
      } else {
        $scope.available = true;
        defer.resolve();
      }

      return defer.promise;

    };

    $scope.passwordChange =  function() {

      var params = {
        oldPassword: $scope.model.oldPassword,
        newPassword: $scope.model.newPassword,
        username: $scope.model.username
      };

      PasswordSrv.change(params);
    };

    $scope.showAccountPasswordReset = function() {
      $scope.showAccountSecurityQuestionsForm = false;
      $scope.showAccountPasswordResetForm = true;
    };

    $scope.showAccountSecurityQuestions = function () {

      var result = passwordQuestions($scope.model.username);
      console.log(result);
      $scope.showAccountSecurityQuestionsForm = result;

    };

    $scope.passwordReset =  function() {

      console.log( $scope.model);
      //return;
      // save data
      PasswordSrv.reset.save($scope.model,

        function (successResponse) {
          console.log('logged a success...');
          console.log(successResponse);
          $state.go('password-reset-confirmation');

        }, function (errorResponse) {
          console.log('logged an error...');
          console.log(errorResponse);
          console.log($scope.model.username);
          $scope.error = "Unable to check for availablility! " + errorResponse;
          $state.go('password-reset-error',  { 'username':$scope.model.username});
        });
    };

    var passwordQuestions = function(username) {

      var promise = isUserNameAvailable(username);

      promise.then(function(status) {
        console.log('Success: ' + status);
        fetchQuestions(username);

      }, function(reason) {
        console.log('Failed: ' + reason);

      });

    };

  }).directive('equals', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, elem, attrs, ngModel) {
        if(!ngModel) {
          return;
        } // do nothing if no ng-model

        // watch own value and re-validate on change
        scope.$watch(attrs.ngModel, function() {
          validate();
        });

        // observe the other value and re-validate on change
        attrs.$observe('equals', function () {
          validate();
        });

        var validate = function() {
          // values
          var val1 = ngModel.$viewValue;
          var val2 = attrs.equals;

          //console.log(! val1 || ! val2 || val1 === val2);
          // set validity
          ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
        };
      }
    };
  });
