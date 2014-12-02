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
          template: " <ion-nav-view name=\"homeContent\" animation=\"slide-left-right\"></ion-nav-view>",
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
            'homeContent' :{
              templateUrl: "templates/home.tpl.html",
              controller: 'HomeCtrl'
            }
          }
        })

        .state('main', {
          url: "/main",
          abstract: true,
          templateUrl: "templates/menu.tpl.html"
        })

        .state('main.tabs', {
          url: "/tab",
          abstract: true,
          views: {
            'menu-content': {
              templateUrl: "templates/tabs.tpl.html",
              controller: "MainCtrl"
            }
          }
        })

        //.state('tabs', {
        //  url: "/tabs",
        //  abstract: true,
        //  //templateUrl: "templates/menu.tpl.html",
        //  templateUrl: "templates/tabs.tpl.html",
        //  controller: "AppCtrl"
        //})



        .state('main.tabs.home', {
          url: "/home",
          views: {
            'home-tab': {
              templateUrl: "templates/tabs.main.tpl.html",
              controller: 'MainCtrl'
            }
          }
        })

        .state('main.tabs.about', {
          url: "/about",
          views: {
            'about-tab': {
              templateUrl: "templates/tabs.about.tpl.html",
              controller: 'MainCtrl'
            }
          }
        })


        .state('main.tabs.contact', {
          url: "/contact",
          views: {
            'contact-tab': {
              templateUrl: "templates/tabs.contact.tpl.html",
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

        .state('app.passwordReset', {
          url: '/passwordReset',
          views: {
            'menuContent' :{
              templateUrl: 'templates/password-reset.tpl.html',
              controller: 'PasswordCtrl'
            }
          }
        })

        .state('app.profile', {
          url: '/profile',
          views: {
            'menuContent' :{
              templateUrl: 'templates/profile.tpl.html'
            }
          }
        })

      ;
      $urlRouterProvider.otherwise('/app/home');
      //$urlRouterProvider.otherwise('/app/activate?username=phillyger@gmail.com&activationToken=60970461743423151453');
      //$urlRouterProvider.otherwise('/app/verify');

    }]);

}(this.angular));
