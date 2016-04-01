angular
  .module('hshs').controller('allianceController', ['$rootScope', '$scope', '$routeParams', '$sce', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $routeParams, $sce, allianceService, clubService, cityService) {

    allianceService.get().then(function(data) {
      $scope.alliances = data.data.result;
    });

    if ($routeParams.allianceId) {
      var allianceId = $routeParams.allianceId;

      cityService.get(allianceId).then(function(data) {
        $scope.city = data.data['0']['name'];
        clubService.get(allianceId).then(function(data) {
          $scope.clubs = data.data.result;
        });
      });
    }

    if ($routeParams.clubId) {
      var clubId = $routeParams.clubId;

      clubService.getDetail(clubId).then(function(data) {
        $scope.clubDetail = data.data;
        $scope.clubDescription = $sce.trustAsHtml(data.data.description);
      });
    }

  }]);