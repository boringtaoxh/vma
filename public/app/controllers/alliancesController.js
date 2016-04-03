angular
  .module('hshs').controller('allianceController', ['$rootScope', '$scope', '$routeParams', '$sce', '$localStorage', 'allianceService', 'clubService', 'cityService', function ($rootScope, $scope, $routeParams, $sce, $localStorage, allianceService, clubService, cityService) {

    $scope.ready = false;
    allianceService.getAll().then(function(data) {
      $scope.alliances = data.data.result;
      $scope.ready = true;
    });

  }]);