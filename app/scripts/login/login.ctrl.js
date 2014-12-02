'use strict';

/**
 * @ngdoc function
 * @name registrationClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the registrationClientApp
 */
angular.module('RegistrationClientApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $state, $ionicHistory, $ionicModal, AuthenticationService, CommonFormService) {
    $rootScope.authenticationError = false;

    // Handle modal
    //$ionicModal.fromTemplateUrl('templates/login.tpl.html', {
    //  scope: $scope,
    //  animation: 'slide-in-up',
    //  focusFirstInput: true
    //}).then(function(modal) {
    //  $scope.loginModal = modal;
    //});

    // Handle modal
    $ionicModal.fromTemplateUrl('templates/register.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.registerModal = modal;
    });

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

    //$scope.openLoginModal = function() {
    //  console.log('Running open modal');
    //
    //  $scope.loginModal.show();
    //}
    //
    //$scope.openRegisterModal = function() {
    //  console.log('Running open register modal');
    //
    //  $scope.registerModal.show();
    //  //$state.go('app.register');
    //}
    //
    //$scope.closeRegisterModal = function() {
    //  $scope.registerModal.hide();
    //};




    $scope.closeLoginModal = function() {
      $scope.loginModal.hide();
    };


    $scope.login = function() {
      console.log('Call login...');
      $scope.closeLoginModal();
      AuthenticationService.login($scope.user);
    };


    $scope.$on('event:auth-loginRequired', function(e, rejection) {
      console.log('Receive the event:auth-loginRequired observation ...');
      $scope.loginModal.show();
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.username = null;
      $scope.password = null;
    });

    $scope.$on('event:auth-login-failed', function(e, outcome) {

      switch(outcome.code) {
        case "400003":
          //$state.go('activate-error', {'outcome': JSON.stringify(outcome)});

          showAlert();
          break;
        default:
          //$rootScope.outcome = JSON.stringify(outcome);
          //$state.transitionTo('login-error');
          showAlert();
          break;
      }
    });

    $scope.$on('event:auth-logout-complete', function() {
      $state.go('app.home', {}, {reload: true, inherit: false});
    });

    // An alert dialog
    var showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Credentials!!!',
        template: 'Unable to valid credentials'
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    };



    $scope.available = false;
    $scope.allQuestionsUrl = [];
    $scope.questionSelections = {};
    $scope.vm = null;


    $scope.register = function () {

      $scope.closeRegisterModal();

      // an array of selected questions
      var questions = [];

      questions.push($scope.questionSelections.question_1.question);
      questions.push($scope.questionSelections.question_2.question);
      questions.push($scope.questionSelections.question_3.question);



      // an array of inputed answers
      var answers = [];
      answers.push($scope.answer_1);
      answers.push($scope.answer_2);
      answers.push($scope.answer_3);


      var securityQuestions = CommonFormService.buildSecurityQuestionsList(questions, answers);

      //return console.log(securityQuestions);

      // add new array property to vm
      $scope.vm.securityQuestions = securityQuestions;

      //return console.log($scope.vm);

      // save data
      RegisterSrv.register.save($scope.vm,

        function (successResponse) {
          //console.log('logged a success...');
          //console.log( JSON.stringify(successResponse.data) );
          UserInfoFactory.setUserInfo(JSON.stringify(successResponse.data));
          $state.transitionTo('register.confirmation');

        }, function (errorResponse) {
          //console.log('logged an error...');
          //console.log(errorResponse.outcome);


          $state.go('register.error',  { outcome: errorResponse.outcome});
        });
    };

    // Handle the security questions
    var fetchQuestions = function () {
      var allQuestionsPromise = CommonFormService.allSecurityQuestions();
      allQuestionsPromise.then(
        function (successResponse) {
          if (successResponse) {
            //console.log(successResponse);
            $scope.allQuestions = successResponse.data;

          }
        },
        function (errorResponse) {
          $scope.error = "Unable to check for availablility! " + errorResponse;
        });

    };

    // kudos to http://jsfiddle.net/Quadraxas/9nsTd/6/
    $scope.optionFilter = function(selectedOptionModel){
      return function(option){

        if(option === selectedOptionModel) {
          return true;
        }
        else{
          for(var key in $scope.questionSelections){
            if(option===$scope.questionSelections[key]) {
              return false;
            }
          }
          //console.log(JSON.stringify($scope.questionSelections));
          //console.log($scope.questionSelections);

          return true;
        }
      };

    };



    // call fetchQuestions method
    // TODO : Move this to a resolve()
    fetchQuestions();

    /*
      Handle Password Reset
     */
    $ionicModal.fromTemplateUrl('templates/register.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.registerModal = modal;
    });



  });

