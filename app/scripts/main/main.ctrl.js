'use strict';

/**
 * @ngdoc function
 * @name registrationClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the registrationClientApp
 */
angular.module('RegistrationClientApp')
  .controller('MainCtrl', function($scope) {

    console.log('MainCtrl Controller initiated...');

    $scope.onControllerChanged = function(oldController, oldIndex, newController, newIndex) {
      console.log('Controller changed', oldController, oldIndex, newController, newIndex);
      console.log(arguments);
    };
  });
