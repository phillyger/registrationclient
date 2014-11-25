/**
 * Created by gosullivan on 11/4/14.
 */

'use strict';

angular.module('RegistrationClientApp')
  .controller('ActivateCtrl',
  function ($scope, $location, $state, $ionicPopup, ActivateSrv, UserInfoFactory) {
    $scope.vm = {
      username: null,
      password: null
    }

    $scope.vm.username = $location.search().username;
    $scope.activationToken = $location.search().activationToken;


    $scope.activate = function () {
      // save data

      ActivateSrv.activate({
        username: $scope.vm.username,
        password: $scope.vm.password,
        activationToken: $scope.activationToken
      });
    };

    $scope.$on("event:activate-login-failed", function() {
      //$state.go('activate-error');
      showActivateAlertError();
    });



    var showActivateAlertError = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Activation Error!!!',
        template: 'Unable to activate account for '
        +JSON.parse(UserInfoFactory.getUserInfo()).username
        +'. Please verify credentials.'
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        //$scope.closeRegisterModal();
      });
    };

  });
