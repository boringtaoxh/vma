angular
  .module('hshs').controller('allianceController', ['$rootScope', '$scope', '$http', '$routeParams', '$sce', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $http, $routeParams, $sce, allianceService, clubService, cityService) {

    allianceService.get().then(function(data) {
      $scope.alliances = data.data.result;
    });

    if ($routeParams.allianceId) {
      cityService.get($routeParams.allianceId).then(function(data) {
        $scope.city = data.data['0']['name'];
        clubService.get($routeParams.allianceId).then(function(data) {
          $scope.clubs = data.data.result;
        });
      });
    }

    if ($routeParams.clubId) {
      clubService.getDetail($routeParams.clubId).then(function(data) {
        $scope.clubDetail = data.data;
        $scope.clubDescription = $sce.trustAsHtml(data.data.description);
      });
    }
  }]);