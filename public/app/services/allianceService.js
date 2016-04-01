angular
  .module('hshs').factory('allianceService', ['$rootScope', '$http', '$location', 'toaster', function ($rootScope, $http, $location, toaster) {
    var baseUrl = 'http://222.240.208.174:8083/vma/api/';

    output = {
      get: function () {
        promise = $http({
          method: 'GET',
          url: baseUrl + 'alliance/list',
          params: { pageSize: 9999, pageNo: 1 },
        }).success(function (response) {
          console.log("alliances:");
          console.log(response.result);
          return response.result;
        }).error(function (data, status) {
          console.log('error');
        });
        return promise;
      }
    }

    return output;
  }]);
