'use strict';

angular.module('RegistrationClientApp')
  .controller('RegisterCtrl',
  function ($scope,  $state, $ionicModal, RegisterSrv, UserInfoFactory, CommonFormService) {

    console.log('Regi');



    $scope.available = false;
    $scope.allQuestionsUrl = [];
    $scope.questionSelections = {};
    $scope.vm = null;
    $scope.submitted = false;
    //$scope.password = '';


    $scope.submit = CommonFormService.submit();

    $scope.interacted = function(field) {
      CommonFormService.interacted(field);
    };


    $scope.interacted = function(field) {
      return $scope.submitted || field.$dirty;
    };


    $scope.register = function () {

      // close the modal
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
          $state.transitionTo('app.register-confirmation');

        }, function (errorResponse) {
          //console.log('logged an error...');
          //console.log(errorResponse.outcome);


          $state.go('app.register-error',  { outcome: errorResponse.outcome});
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
  }


);
