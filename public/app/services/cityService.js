angular
  .module('hshs').factory('cityService', ['$rootScope', '$http', '$location', 'toaster', function ($rootScope, $http, $location, toaster) {
    var baseUrl = 'http://222.240.208.174:8083/vma/api/';

    output = {
      get: function (allianceId) {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'regions/list',
          params: { allianceId: allianceId },
        }).success(function (response) {
          return response.result;
        }).error(function (data, status) {
          console.log('error');
        });
        return promise;
      }
    };

    return output;
  }]);
