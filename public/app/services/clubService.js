angular
    .module('hshs').factory('clubService', ['$rootScope', '$http', '$location', 'toaster', function ($rootScope, $http, $location, toaster) {
        var baseUrl = 'http://222.240.208.174:8083/vma/api/';
        var clubService = {};

        output = {
            get: function (allianceId) {
                promise = $http({
                    method: 'GET',
                    url: baseUrl + 'club/list',
                    params: { pageSize: 9999, pageNo: 1, allianceId: allianceId },
                }).success(function (response) {
                    console.log(response);
                    return response.result;
                }).error(function (data, status) {
                    console.log('error');
                });
                return promise;
            },
            getDetail: function (clubId) {
                promise = $http({
                    method: 'GET',
                    url: baseUrl + 'club/detail',
                    params: { id: clubId },
                }).success(function (response) {
                    return response;
                }).error(function (data, status) {
                    console.log('error');
                });
                return promise;
            }
        }

        return output;
    }]);
