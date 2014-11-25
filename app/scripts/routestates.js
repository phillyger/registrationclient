(function (angular) {
  'use strict';

  angular.module('RegistrationClientApp')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      // default to general
      //$urlRouterProvider.when('/profile', '/profile/general');

      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.tpl.html",
          controller: "AppCtrl"
        })

        .state('app.home', {
          url: "/home",
          resolve: {
            allSecurityQuestionsPromise : function (CommonFormService) {
              return CommonFormService.allSecurityQuestions();
            }
          },
          views: {
            'menuContent' :{
              templateUrl: "templates/home.tpl.html",
              controller: 'HomeCtrl'
            }
          }
        })

        .state('app.main', {
          url: "/main",
          views: {
            'menuContent' :{
              templateUrl: "templates/main.tpl.html",
              controller: 'MainCtrl'
            }
          }
        })


        .state('logout', {
          url: '/logout',
          templateUrl: 'templates/logout.tpl.html',
          resolve:{
            logout: function(UserFactory) {
              UserFactory.logout();
            }
          },
          controller: function($scope, UserInfoFactory) {

            var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
            console.log(userInfo);
            $scope.message = userInfo.firstName + ' '+ userInfo.lastName +' has been logged out.';

          }
        })
        .state('app.activate', {
          url: '/activate',
          views: {
            'menuContent' :{
              templateUrl: 'templates/activate.tpl.html',
              controller: 'ActivateCtrl'
            }
          }
        })

        .state('app.verify', {
          url: '/verify',
          views: {
            'menuContent' :{
              templateUrl: 'templates/verify.tpl.html',
              controller: 'VerifyCtrl'
            }
          }
        })

      ;
      $urlRouterProvider.otherwise('/app/home');
      //$urlRouterProvider.otherwise('/app/activate?username=phillyger@gmail.com&activationToken=38805423323709692581');

    }]);

}(this.angular));
