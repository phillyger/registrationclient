/**
 * Created by gosullivan on 11/3/14.
 */

'use strict';

angular.module('RegistrationClientApp')
  .controller('VerifyCtrl',
  function ($scope, VerifySrv, $state, $stateParams, $ionicPopup, UserInfoFactory, CommonFormService) {

    $scope.vm = null;
    $scope.dates = {
      dob: null
    };



    $scope.submit = CommonFormService.submit();

    $scope.interacted = function(field) {
      CommonFormService.interacted(field);
    };

    $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };

    $scope.vm = {
      firstName: null,
      lastName: null,
      birthDate: null,
      zip: null,
      username: null

    }


    $scope.verify = function () {

      // get the user info
      var userInfo = JSON.parse(UserInfoFactory.getUserInfo());

      console.log($scope.dates.dob);

      $scope.vm.birthDate = JSON.parse(JSON.stringify($scope.dates.dob));  // call .parse(.stringify) to remove double quotes
      $scope.vm.username = userInfo.username;

      //return console.log($scope.vm);
      //// save data
      VerifySrv.verify.save($scope.vm,

        function (successResponse) {

          //$state.go('verify.confirmation');
          showVerifyAlertSuccess()

        }, function (errorResponse) {
          //$state.go('verify.error');
          showVerifyAlertError()
        });
    };

    var showVerifyAlertError = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Verify Error!!!',
        template: 'Unable to verify account for '
        +JSON.parse(UserInfoFactory.getUserInfo()).username
        +'. Please verify member information.'
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        //$scope.closeRegisterModal();
      });
    };

    var showVerifyAlertSuccess = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Verification Successful!!!',
        template: 'Successfully verified account for '
        +JSON.parse(UserInfoFactory.getUserInfo()).username
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        //$scope.closeRegisterModal();
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



