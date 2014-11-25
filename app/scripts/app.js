'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('RegistrationClientApp',
  [
    'ionic',
    'config',
    'ui.router',
    'http-auth-interceptor',
    'ngMessages',
    'ui.bootstrap',
    'ui.mask',
    'ngResource'
  ]
);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($provide, $httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('$ionicLoadingConfig', {
  template: 'Default Loading Template...'
});

app.controller('AppCtrl', function($scope, $ionicLoading) {

  $scope.showLoading = function() {
    $ionicLoading.show(); //options default to values in $ionicLoadingConfig
  };

  $scope.hideLoading = function() {
    $ionicLoading.hide(); //options default to values in $ionicLoadingConfig
  };

})




app.factory('UserFactory', function UserFactory($window, AuthenticationService, AuthTokenFactory) {

  function login(username, password) {

    return AuthenticationService.login({
      username: username,
      password: password
    });
  }

  function logout() {

    AuthTokenFactory.setToken();

  }

  //function handleError(response) {
  //  alert('Error: ' + response.data);
  //}

  return {
    login: login,
    logout: logout
  };


});

app.factory('UserInfoFactory', function UserInfoFactory($window, $http, $q, $log, URL_ENDPOINTS) {

  var store = $window.localStorage;
  var key = 'user-info';

  function getUserInfo() {
    return store.getItem(key);
  }

  function setUserInfo(info) {
    if (info) {
      store.setItem(key, info);
    } else {
      store.removeItem(key);
    }
  }

  //function fetchAccountInfo(id) {
  //
  //    return $http.get(URL_ENDPOINTS.secureAccountUrl+id);
  //
  //}

  function fetchAccountInfo(id) {

    var deferred = $q.defer();

    if (id) {
      //console.log(URL_ENDPOINTS.secureAccountUrl+id);
      $http.get(URL_ENDPOINTS.secureAccountUrl+id)
        .success(function (data) {
          //console.log('Hello');
          deferred.resolve({
            data: data.data
          });
        }).error(function (msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
    }

    return deferred.promise;

  }

  function fetchSecurityQuestions() {

    var deferred = $q.defer();

    var username = JSON.parse(getUserInfo()).username;

    if (username) {
      $http.get(URL_ENDPOINTS.accountUrl + username + '/questions')
        .success(function (data) {
          deferred.resolve({
            data: data.data
          });
        }).error(function (msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
    }
    return deferred.promise;
  }

  return {
    getUserInfo: getUserInfo,
    setUserInfo: setUserInfo,
    fetchAccountInfo: fetchAccountInfo,
    fetchSecurityQuestions: fetchSecurityQuestions
  };

});


app.factory('AuthTokenFactory', function AuthTokenFactory($window) {

  var store = $window.localStorage;
  var key = 'auth-token';


  function getToken() {
    return store.getItem(key);
  }

  function setToken(token) {
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }

  return {
    getToken: getToken,
    setToken: setToken
  };


});

app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory, AUTH_TOKEN_INFO) {

  function addToken(config) {
    var token = AuthTokenFactory.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers[AUTH_TOKEN_INFO.key] = token;
    }

    return config;
  }

  return {
    request: addToken
  };

});

app.factory("CommonFormService", function($http, $q, $log, URL_ENDPOINTS) {

  var isSubmitted = false;

  function init() {
    isSubmitted = false;
    return isSubmitted;
  }

  function submit() {
    isSubmitted = true;
    return isSubmitted;
  }

  function interacted(field) {
    return isSubmitted || field.$dirty;
  }

  function buildSecurityQuestionsList(questions, answers) {
    // an array of questions and answers
    var securityQuestions = [];

    // build array of dictionaries of Q&A.
    for(var i in questions) {
      var securityQuestionsDict = {};
      securityQuestionsDict[ 'question' ] = questions[i];
      securityQuestionsDict[ 'answer' ] = answers[i];

      // add dict to securityQuestions array
      securityQuestions.push(securityQuestionsDict);
    }

    return securityQuestions;
  }

  function allSecurityQuestions() {

    var deferred = $q.defer();
    $http.get(URL_ENDPOINTS.allQuestionsUrl)
      .success(function(data) {
        deferred.resolve({
          data: data.data
        });
      }).error(function(msg, code) {
        deferred.reject(msg);
        $log.error(msg, code);
      });
    return deferred.promise;
  }

  return {
    init: init,
    submit: submit,
    interacted: interacted,
    allSecurityQuestions: allSecurityQuestions,
    buildSecurityQuestionsList: buildSecurityQuestionsList
  };
});


app.factory("UserNameService", function($http, URL_ENDPOINTS) {


  function checkAvailability(email) {
    return $http.get(URL_ENDPOINTS.available+'?email='+email);
  }

  return {
    checkAvailability: checkAvailability
  };
});

app.filter('replaceSpacesWithHyphen', function () {
  return function (text) {

    return text.replace(/\s+/g, '-');

  };
});


;

