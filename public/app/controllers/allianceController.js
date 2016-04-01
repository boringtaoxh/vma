angular
  .module('hshs').controller('allianceController', ['$rootScope', '$scope', '$http', '$routeParams', '$sce', 'allianceService', 'clubService', function ($rootScope, $scope, $http, $routeParams, $sce, allianceService, clubService) {

    allianceService.get().then(function(data) {
      $scope.alliances = data.data.result;
    });

    if ($routeParams.allianceId) {
      console.log($routeParams.allianceId);
      clubService.get($routeParams.allianceId).then(function(data) {
        $scope.clubs = data.data.result;
      });
    }

    if ($routeParams.clubId) {
      clubService.getDetail($routeParams.clubId).then(function(data) {
        console.log(data.data);
        $scope.clubDetail = data.data;
        $scope.clubDescription = $sce.trustAsHtml(data.data.description);
      });
    }

  }]);