'use strict';


angular.module('RegistrationClientApp').factory('VerifySrv', ['$rootScope', '$http', '$resource', '$state', '$q', 'URL_ENDPOINTS',
  function ($rootScope, $http, $resource, $state, $q, URL_ENDPOINTS) {
    return {
      verify: $resource(URL_ENDPOINTS.secureVerifyUrl, {}, {}),

      available: $resource(URL_ENDPOINTS.available +'?email=:email', {},
        {
          'get': {method: 'GET', params: {}, isArray: false}
        })
    };
  }]);


