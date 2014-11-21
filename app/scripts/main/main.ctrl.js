'use strict';

/**
 * @ngdoc function
 * @name registrationClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the registrationClientApp
 */
angular.module('RegistrationClientApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
