angular
  .module('hshs').factory('allianceService', ['$rootScope', '$http', 'toaster', 'baseUrl', function ($rootScope, $http, toaster, baseUrl) {
    var promise = {};

    output = {
      get: function () {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'alliance/list',
          params: {},
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
