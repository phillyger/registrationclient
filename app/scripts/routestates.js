(function (angular) {
  'use strict';

  angular.module('RegistrationClientApp')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      // default to general
      //$urlRouterProvider.when('/profile', '/profile/general');

      $stateProvider
        .state('main', {
          url: '/main',
          templateUrl: 'templates/main.tpl.html',
          controller: 'MainCtrl'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.tpl.html',
          controller: 'LoginCtrl'
        })
        .state('login-error', {
          url: '/error',
          templateUrl: 'templates/login.error.tpl.html',
          controller: function($rootScope, $scope) {
            console.log($rootScope.outcome);
            $scope.outcome = angular.copy($rootScope.outcome);
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
      //  .state('settings', {
      //    url: '/settings',
      //    templateUrl: 'views/settings.tpl.html',
      //    controller: 'SettingsCtrl'
      //  })
      //  .state('register', {
      //    url: '/register',
      //    templateUrl: 'views/register.tpl.html',
      //    controller: 'RegisterCtrl',
      //    resolve:{
      //      data: ['$stateParams', function($stateParams){
      //        return $stateParams.data;
      //      }]
      //    }
      //  })
      //  .state('register.confirmation', {
      //    url: '/confirmation',
      //
      //    views: {
      //      '@': {
      //        templateUrl: 'views/register.confirmation.tpl.html',
      //        controller: function($scope, UserInfoFactory){
      //          var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //          $scope.firstName = userInfo.firstName;
      //          $scope.username = userInfo.username;
      //
      //        }
      //
      //
      //      }
      //    }
      //
      //  })
      //  .state('register.error', {
      //    params: ['outcome'],
      //    templateUrl: 'views/register.error.tpl.html',
      //    controller: function() {
      //
      //    }
      //  })
      //  .state('verify', {
      //    url: '/verify',
      //    templateUrl: 'views/verify.tpl.html',
      //    controller: 'VerifyCtrl'
      //  })
      //  .state('verify.confirmation', {
      //    url: '/confirmation',
      //
      //    views: {
      //      '@': {
      //        templateUrl: 'views/verify.confirmation.tpl.html',
      //        controller: function($scope, $state, UserInfoFactory){
      //          var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //          $scope.firstName = userInfo.firstName;
      //          $scope.username = userInfo.username;
      //
      //        }
      //      }
      //    }
      //  })
      //  .state('verify.error', {
      //    url: '/error',
      //
      //    views: {
      //      '@': {
      //        templateUrl: 'views/verify.error.tpl.html',
      //        controller: function($scope, UserInfoFactory){
      //          var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //          $scope.firstName = userInfo.firstName;
      //          $scope.username = userInfo.username;
      //
      //        }
      //      }
      //    }
      //  })
      //  .state('profile', {
      //    url: '/profile',
      //    abstract: true,
      //    templateUrl: 'views/profile.tpl.html',
      //    controller: function($scope) {
      //      $scope.profileList = [
      //        {name: 'General'},
      //        {name: 'Change Password'}
      //      ];
      //    }
      //  })
      //  .state('profile.change-password', {
      //    parent: 'profile',
      //    url: '/change-password',
      //    templateUrl: 'views/profile.password.tpl.html',
      //    controller: 'ProfilePasswordCtrl'
      //  })
      //  .state('profile.general', {
      //    parent: 'profile',
      //    resolve: {
      //
      //      userAccountInfoPromise: function (UserInfoFactory) {
      //        var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //        if (userInfo.id) {
      //          return UserInfoFactory.fetchAccountInfo(userInfo.id);
      //        }
      //      },
      //
      //      allSecurityQuestionsPromise: function (CommonFormService) {
      //
      //        return CommonFormService.allSecurityQuestions();
      //      }
      //
      //
      //    },
      //    url: '/general',
      //    templateUrl: 'views/profile.general.tpl.html',
      //
      //    controller: 'ProfileGeneralCtrl'
      //  })
      //  .state('profile.confirmation', {
      //    url: '/confirmation',
      //
      //    views: {
      //      '@': {
      //        templateUrl: 'views/profile.confirmation.tpl.html',
      //        controller: function($scope, $state, UserInfoFactory){
      //          var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //          $scope.firstName = userInfo.firstName;
      //          $scope.username = userInfo.username;
      //
      //        }
      //      }
      //    }
      //  })
      //  .state('profile.error', {
      //    url: '/error',
      //
      //    views: {
      //      '@': {
      //        templateUrl: 'views/profile.error.tpl.html',
      //        controller: function($scope, UserInfoFactory){
      //          var userInfo = JSON.parse(UserInfoFactory.getUserInfo());
      //          $scope.firstName = userInfo.firstName;
      //          $scope.username = userInfo.username;
      //
      //        }
      //      }
      //    }
      //  })
      //  .state('activate', {
      //    url: '/activate',
      //    templateUrl: 'views/activate.tpl.html',
      //    controller: 'ActivateCtrl'
      //  })
      //  .state('activate-error', {
      //    params: ['outcome'],
      //    templateUrl: 'views/activate-error.tpl.html',
      //    controller: 'ActivateErrorCtrl'
      //  })
      //  .state('password-change', {
      //    url: '/passwordChange',
      //    templateUrl: '../views/profile.password.change.tpl.html',
      //    controller: 'PasswordCtrl'
      //  })
      //  .state('password-reset', {
      //    url: '/passwordReset',
      //    templateUrl: 'views/password-reset.tpl.html',
      //    controller: 'PasswordCtrl'
      //  })
      //  .state('password-reset-confirmation', {
      //    params:['username'],
      //    templateUrl: 'views/password-reset-confirmation.tpl.html',
      //    controller: 'PasswordCtrl'
      //  })
      //  .state('password-reset-error', {
      //    params:['username'],
      //    templateUrl: 'views/password-reset-error.tpl.html',
      //    controller: 'PasswordCtrl'
      //  })
      //.state('password-confirmation', {
      //  params:['username'],
      //  templateUrl: 'views/password-confirmation.tpl.html',
      //  controller: 'PasswordCtrl'
      //})
      //  .state('password-error', {
      //    params:['username'],
      //    templateUrl: 'views/password-error.tpl.html',
      //    controller: 'PasswordCtrl'
      //  })
      //  .state('error', {
      //    params: ['outcome'],
      //    templateUrl: 'views/error.tpl.html',
      //    controller: 'VerifyCtrl'
      //  })
      ;
      $urlRouterProvider.otherwise('/main');

    }]);

}(this.angular));
