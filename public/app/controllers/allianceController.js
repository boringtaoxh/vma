angular
  .module('hshs').controller('allianceController', ['$rootScope', '$scope', '$routeParams', '$sce', '$localStorage', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $routeParams, $sce, $localStorage, allianceService, clubService, cityService) {

    var allianceId, clubId, cities;

    /* alliance */
    allianceService.get().then(function(data) {
      $scope.alliances = data.data.result;
    });

    /* clubs */
    if ($routeParams.allianceId) {
      allianceId = $routeParams.allianceId;
      $scope.allianceId = allianceId;

      cityService.get(allianceId).then(function(data) {
        if (!_.isEmpty(data.data)) {
          $scope.cityName = data.data['0']['name'];
        }
      });

      clubService.get(allianceId).then(function(data) {
        $scope.clubs = data.data.result;
      });
    }

    /* club */
    if ($routeParams.clubId) {
      clubId = $routeParams.clubId;

      clubService.getDetail(clubId).then(function(data) {
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
      });
    }

  }]);