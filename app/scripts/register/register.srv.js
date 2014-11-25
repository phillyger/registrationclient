'use strict';


angular.module('RegistrationClientApp').factory('RegisterSrv',
  ['$rootScope',
    '$http',
    '$resource',
    '$state',
    'URL_ENDPOINTS',
  function ($rootScope, $http, $resource, $state, URL_ENDPOINTS) {
    return {
      register: $resource(URL_ENDPOINTS.registerUrl, {}, {}),

      available: $resource(URL_ENDPOINTS.available+'?email=:email', {},
        {
          'get': {method: 'GET', params: {}, isArray: false}
        })

      //available: function(email) {
      //  return $http.get(urlSrv.baseUrl + '/rest/available?email='+email);
      //},

      //available: function() {
      //  return $resource(urlSrv.baseUrl + '/rest/available?email=:email', {},
      //    {
      //      'get': {method: 'GET', params: {}, isArray: false}
      //    });
      //},


    };
  }]);


