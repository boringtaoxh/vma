angular
  .module('hshs').factory('cityService', ['$rootScope', '$http', '$localStorage', 'toaster', 'baseUrl', function ($rootScope, $http, $localStorage, toaster, baseUrl) {
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
      },
      getAll: function () {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'regions/list',
          params: { },
        }).success(function (response) {
          $localStorage.vmaCity = response;
          return response;
        }).error(function (data, status) {
          console.log(status);
        });
        return promise;
      },
      getName: function (cities, cityId) {
        var city = _.find(cities, {"id": cityId});
        return city.name;
      }
    };

    return output;
  }]);
