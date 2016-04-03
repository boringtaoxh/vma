angular
  .module('hshs').controller('clubController', ['$rootScope', '$scope', '$routeParams', '$sce', '$localStorage', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $routeParams, $sce, $localStorage, allianceService, clubService, cityService) {

    var allianceId, clubId, cities;
    allianceId = parseInt($routeParams.allianceId);
    $scope.allianceId = allianceId;

    if ($routeParams.clubId) {
      clubId = $routeParams.clubId;

      $scope.ready = false;
      clubService.getDetail(clubId).then(function(data) {
        $scope.allianceName = $localStorage.vmaAllianceName;
        $scope.clubDetail = data.data;
        $scope.clubDescription = $sce.trustAsHtml(data.data.description);
        if ($localStorage.vmaCity === undefined) {
          cityService.getAll().then(function(data) {
            $scope.cityName = cityService.getName(cities);
          });
        } else {
          cities = $localStorage.vmaCity;
          $scope.cityName = cityService.getName(cities, data.data.cityId);
        }
        $scope.ready = true;
      });
    }

  }]);