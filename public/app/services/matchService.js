angular
  .module('hshs').factory('matchService', ['$rootScope', '$http', '$localStorage', 'toaster', 'baseUrl', function ($rootScope, $http, $localStorage, toaster, baseUrl) {
    var promise = {};

    output = {
      getAll: function () {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'event/list',
          params: { /*status: 0, cityId: 2232*/ },
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