angular
  .module('hshs').directive('breadcrumb', [function () {
    return {
      restrict: 'E',
      templateUrl: "/app/directives/breadcrumb.html",
      controller: function($scope, $location, allianceService, clubService) {
        var currentRoutes = $location.path().match(/\w+/g);
        console.log(currentRoutes);
        $scope.breadcrumb = [];
        if (currentRoutes[0] == 'alliances' && currentRoutes[1] != undefined) {
          var allianceId = parseInt(currentRoutes[1]);
          allianceService.getAll().then(function(data) {
            $scope.breadcrumb[0] = {"link": "/alliances/" + allianceId + "/clubs", "name": allianceService.getName(data.data.result, allianceId)};
          })
        }
        if (currentRoutes[2] == 'clubs' && currentRoutes[3] != undefined) {
          var clubId = parseInt(currentRoutes[3]);
          clubService.getDetail(clubId).then(function(data) {
            $scope.breadcrumb[1] =  {"link": "/alliances/" + allianceId + "/clubs/" + clubId, "name": data.data.name};
          })
        }
      }
    }
  }]);