angular
  .module('hshs').factory('matchService', ['$rootScope', '$http', '$localStorage', 'toaster', 'baseUrl', function ($rootScope, $http, $localStorage, toaster, baseUrl) {
    var promise = {};

    output = {
      getAll: function (status, city) {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'event/list',
          params: { status: status, cityId: city },
        }).success(function (response) {
          return response;
        }).error(function (data, status) {
          console.log(status);
        });
        return promise;
      }
    };

    return output;
  }]);