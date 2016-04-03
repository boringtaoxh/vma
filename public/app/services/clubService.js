angular
  .module('hshs').factory('clubService', ['$rootScope', '$http', 'toaster', 'baseUrl', function ($rootScope, $http, toaster, baseUrl) {
      var promise = {};

      output = {
          getAll: function (allianceId) {
              promise = $http({
                  method: 'GET',
                  url: baseUrl + 'club/list',
                  params: { allianceId: allianceId }
              }).success(function (response) {
                  return response.result;
              }).error(function (data, status) {
                  console.log(status);
              });
              return promise;
          },
          getDetail: function (clubId) {
              promise = $http({
                  method: 'GET',
                  url: baseUrl + 'club/detail',
                  params: { id: clubId }
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
