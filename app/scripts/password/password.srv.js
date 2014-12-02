/**
 * Created by gosullivan on 11/4/14.
 */

'use strict';


angular.module('RegistrationClientApp').factory('PasswordSrv', ['$rootScope', '$http', '$resource', '$state', 'URL_ENDPOINTS',
  function ($rootScope, $http, $resource, $state, URL_ENDPOINTS) {
    return {

      reset: $resource(URL_ENDPOINTS.resetPasswordUrl, {}, {}),

      available: $resource(URL_ENDPOINTS.available+'?email=:email', {},
        {
          'get': {method: 'GET', params: {}, isArray: false}
        }),

      questions: $resource(URL_ENDPOINTS.accountUrl+':username/questions', {},
        {
          'get': {method: 'GET', params: {}, isArray: false}
        }),

      change: function (param) {
        var data ='{"username":"' + param.username +
          '","newPassword":"' + param.newPassword +
          '","oldPassword":"'+ param.oldPassword +
          '","newConfirmedPassword":"'+ param.newConfirmedPassword +'"}';
        //console.log(data);
        //console.log(param.username);
        $http.post(URL_ENDPOINTS.changePasswordUrl, data,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            ignoreAuthModule: 'ignoreAuthModule'
          }
        ).success(function (data, status, headers, config) {
            console.log('successful activation' + data + status + headers + config);
            $state.go('password-confirmation', { 'username':param.username});

          }
        ).error(function (data, status, headers, config) {
            console.log('error activation' + data + status + headers + config);
            $state.go('password-error', { 'username':param.username});
          }
        );
      }
    };
  }]);
