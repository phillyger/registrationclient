/**
 * Created by gosullivan on 11/6/14.
 */
'use strict';

angular.module('RegistrationClientApp')
  .factory('AuthenticationService',
  function ($rootScope, $http, $state, authService, AUTH_TOKEN_INFO, AuthTokenFactory, UserInfoFactory, URL_ENDPOINTS) {
    var service = {
      login: function (user) {
        var payload = '{"username":"' + user.username + '","password":"' + user.password + '"}';
        $http.post(URL_ENDPOINTS.authenticateUrl, payload, {ignoreAuthModule: true})
          .success(function (response) {
            console.log('authenticate POST success');
            return response;
          })
          .error(function (response) {
            console.log('authenticate POST failed');
            console.log(response.outcome);
            $rootScope.$broadcast('event:auth-login-failed', response.outcome);
          }).then(function success(response) {

            //angular.forEach(response.headers(), function(key, value) {
            //  console.log(key +" : " + value)
            //})

            AuthTokenFactory.setToken(response.headers(AUTH_TOKEN_INFO.key));
            $http.defaults.headers.common[AUTH_TOKEN_INFO.key] = response.headers(AUTH_TOKEN_INFO.key);

            // Need to inform the http-auth-interceptor that
            // the user has logged in successfully.  To do this, we pass in a function that
            // will configure the request headers with the authorization token so
            // previously failed requests(aka with status == 401) will be resent with the
            // authorization token placed in the header
            authService.loginConfirmed(response.data, function (config) {  // Step 2 & 3

              //console.log(AUTH_TOKEN_INFO.key + " : " + AuthTokenFactory.getToken());
              config.headers[AUTH_TOKEN_INFO.key] = AuthTokenFactory.getToken();
              return config;
            });

            return response;

          }).then(function success(response) {

            UserInfoFactory.setUserInfo(JSON.stringify(response.data.data));
            return response;

          }).then(function success(response) {
            // check boolean flag to see if user is verified.
            var result = response.data.data;

            return (result['verified'] === true) ? $state.go('main') : $state.go('verify');

          });
      },
      logout: function (config) {
        //$http.post('https://logout', {}, {ignoreAuthModule: true})
        //  .finally(function (data) {
            console.log('Delete token....');
        console.log(config);
            console.log(config.headers[AUTH_TOKEN_INFO.key]);
            delete config.headers[AUTH_TOKEN_INFO.key];
            console.log(config.headers[AUTH_TOKEN_INFO.key]);
            AuthTokenFactory.setToken();
            $rootScope.$broadcast('event:auth-logout-complete');

          //});
      },
      loginCancelled: function () {
        authService.loginCancelled();
      }
    };
    return service;
  });
