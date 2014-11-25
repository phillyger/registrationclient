'use strict';

angular.module('registrationClientApp')
  .controller('ActivateErrorCtrl',
  function ($scope, $stateParams) {

    $scope.outcome = $stateParams.outcome;

  });
