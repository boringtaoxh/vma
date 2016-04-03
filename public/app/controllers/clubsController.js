angular
  .module('hshs').controller('clubsController', ['$rootScope', '$scope', '$routeParams', '$sce', '$localStorage', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $routeParams, $sce, $localStorage, allianceService, clubService, cityService) {

    var allianceId;
    allianceId = parseInt($routeParams.allianceId);
    $scope.allianceId = allianceId;

    $scope.ready = false;
    allianceService.getAll().then(function(data) {
      $scope.allianceName = allianceService.getName(data.data.result, allianceId);
      $localStorage.vmaAllianceName = $scope.allianceName;

      clubService.getAll(allianceId).then(function(data) {
        $scope.clubs = data.data.result;

        cityService.get(allianceId).then(function(data) {
          if (!_.isEmpty(data.data)) {
            $scope.cityName = data.data['0']['name'];
          }
        });
        $scope.ready = true;
      });
    });




  }]);