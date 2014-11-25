/**
 * Created by gosullivan on 11/3/14.
 */

'use strict';

angular.module('RegistrationClientApp')
  .controller('VerifyCtrl',
  function ($scope, VerifySrv, $state, $stateParams, UserInfoFactory, CommonFormService) {

    $scope.vm = null;
    //$scope.zipRegex = /^\d+$/;

    $scope.submit = CommonFormService.submit();

    $scope.interacted = function(field) {
      CommonFormService.interacted(field);
    };

    $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };

    $scope.verify = function () {

      // get the user info
      var userInfo = JSON.parse(UserInfoFactory.getUserInfo());

      $scope.vm.birthDate = JSON.parse(JSON.stringify($scope.dob));  // call .parse(.stringify) to remove double quotes
      $scope.vm.username = userInfo.username;

      console.log($scope.vm);
      //// save data
      VerifySrv.verify.save($scope.vm,

        function (successResponse) {

          $state.go('verify.confirmation');

        }, function (errorResponse) {
          $state.go('verify.error');
        });
    };

  }



).directive('zipcode', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ngModel) {

        //For DOM -> model validation
        ngModel.$parsers.unshift(function (value) {
          return validate(value);
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function (value) {
          return validate(value);
        });

        function validate(value) {
          var valid = true;
          if (angular.isDefined(value) && value.length > 0) {
            valid = /(^\d{5}-?\d{4}$)|(^\d{5}$)/.test(value);
          }


          ngModel.$setValidity('zipcode', valid);
          return value;
        }
      }
    };
  })
;



