/**
 * Created by gosullivan on 11/23/14.
 */
'use strict';
angular.module('RegistrationClientApp')
  .controller('HomeCtrl',
  function($ionicHistory,
           $scope,
           $ionicModal,
           $ionicPopup,
           RegisterSrv,
           AuthenticationService,
           CommonFormService,
           UserInfoFactory,
           allSecurityQuestionsPromise) {
    // This a temporary solution to solve an issue where the back button is displayed when it should not be.
    // This is fixed in the nightly ionic build so the next release should fix the issue
    $ionicHistory.clearHistory();

    console.log('Running HomeCtrl...');

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


    $ionicModal.fromTemplateUrl('templates/login.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function($ionicModal) {
      $scope.loginModal =$ionicModal;
    });

    //Be sure to cleanup the modal by removing it from the DOM
    $scope.$on('$destroy', function() {
      $scope.loginModal.remove();
    });

    $scope.openLoginModal = function() {
      console.log('Running open modal');

      $scope.loginModal.show();
    }

    $scope.closeLoginModal = function() {
      $scope.loginModal.hide();
    };




    $scope.login = function() {
      console.log('Call login...');
      console.log($scope.user);
      AuthenticationService.login($scope.user);
    };



    $scope.$on('event:auth-loginRequired', function(e, rejection) {
      console.log('Receive the event:auth-loginRequired observation ...');
      $scope.loginModal.show();
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.username = null;
      $scope.password = null;
      $scope.closeLoginModal();
    });

    $scope.$on('event:auth-login-failed', function(e, outcome) {

      switch(outcome.code) {
        case "400003":
          //$state.go('activate-error', {'outcome': JSON.stringify(outcome)});

          showLoginAlert();
          break;
        default:
          //$rootScope.outcome = JSON.stringify(outcome);
          //$state.transitionTo('login-error');
          showLoginAlert();
          break;
      }
    });

    $scope.$on('event:auth-logout-complete', function() {
      $state.go('app.home', {}, {reload: true, inherit: false});
    });

    // An alert dialog
    var showLoginAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Credentials!!!',
        template: 'Unable to validate credentials'
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    };

  // Registration


    //$scope.allQuestionsUrl = [];
    $scope.questionSelections = {};
    $scope.securityQuestions = null;
    $scope.vm = {
      username: null,
      password: null,
      firstName: null,
      lastName: null
    };

    $scope.answers = {
      answer1: null,
      answer2: null,
      answer3: null
    }

    $ionicModal.fromTemplateUrl('templates/register.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.registerModal = modal;
    });


    $scope.openRegisterModal = function() {
      console.log('Running open register modal');

      $scope.registerModal.show();
      //$state.go('app.register');
    }

    $scope.closeRegisterModal = function() {
      $scope.registerModal.hide();
    };

    $scope.register = function () {



      // an array of selected questions
      var questions = [];

      questions.push($scope.questionSelections.question_1.question);
      questions.push($scope.questionSelections.question_2.question);
      questions.push($scope.questionSelections.question_3.question);



      // an array of inputed answers
      var answers = [];
      answers.push($scope.answers.answer1);
      answers.push($scope.answers.answer2);
      answers.push($scope.answers.answer3);


      //console.log(answers);

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
          //$state.transitionTo('app.register-confirmation');
          showRegisterAlertSuccess();

        }, function (errorResponse) {
          //console.log('logged an error...');
          console.log(errorResponse.outcome);
          showRegisterAlertError();

        });
    };

    // Handle the security questions
      $scope.allQuestions  = allSecurityQuestionsPromise.data;


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


    // An alert dialog
    var showRegisterAlertError = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Registration Error!!!',
        template: 'Unable to register user:  ' + UserInfoFactory.getUserInfo()
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    };

    var showRegisterAlertSuccess = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Registration Success!!!',
        template: 'Successfully registered new user. An email shall be sent to  ' +JSON.parse(UserInfoFactory.getUserInfo()).username
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        $scope.closeRegisterModal();
      });
    };

  });
