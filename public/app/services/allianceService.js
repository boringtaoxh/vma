angular
  .module('hshs').factory('allianceService', ['$rootScope', '$http', 'toaster', 'baseUrl', function ($rootScope, $http, toaster, baseUrl) {
    var promise = {};

    output = {
      getAll: function () {
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
      },
      getName: function (alliances, allianceId) {
        var alliance = _.find(alliances, {"id": allianceId});
        return alliance.name;
      }
    };

    return output;
  }]);
