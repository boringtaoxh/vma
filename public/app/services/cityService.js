angular
  .module('hshs').factory('cityService', ['$rootScope', '$http', 'toaster', 'baseUrl', function ($rootScope, $http, toaster, baseUrl) {
    var promise = {};

    output = {
      get: function (allianceId) {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'regions/list',
          params: { allianceId: allianceId },
        }).success(function (response) {
          return response.result;
        }).error(function (data, status) {
          console.log(status);
        });
        return promise;
      }
    };

    return output;
  }]);
