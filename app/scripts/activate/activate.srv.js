/**
 * Created by gosullivan on 11/4/14.
 */

'use strict';


angular.module('RegistrationClientApp').factory('ActivateSrv', ['$rootScope', '$http', '$resource', '$state', 'authService', 'AUTH_TOKEN_INFO', 'AuthTokenFactory', 'UserInfoFactory', 'URL_ENDPOINTS',
  function ($rootScope, $http, $resource, $state, authService, AUTH_TOKEN_INFO, AuthTokenFactory, UserInfoFactory, URL_ENDPOINTS) {
    return {

      available: $resource(URL_ENDPOINTS.available+'?email=:email', {},
        {
          'get': {method: 'GET', params: {}, isArray: false}
        }),

      activate: function (param) {
        var data ='{"username":"' + param.username +'","password":"'+ param.password +'", "activationToken":"'+ param.activationToken +'"}';
        console.log(data);
        $http.post(URL_ENDPOINTS.activateUrl, data,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            ignoreAuthModule: 'ignoreAuthModule'
          })
            .success(function (response) {
              console.log('activate POST success');

            })
            .error(function (response) {
              console.log('activate POST failed');
              console.log(response.outcome);
              $rootScope.$broadcast('event:activate-login-failed', response.outcome);
            }).then(function success(response) {

              //angular.forEach(response.headers(), function(key, value) {
              //  console.log(key +" : " + value);
              //});

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
              //var result = response.data.data;
               $state.go('app.verify');
               //$scope.showLoading();

            });
      }
    };
  }]);
