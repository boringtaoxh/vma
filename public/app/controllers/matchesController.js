angular
  .module('hshs').controller('matchesController', ['$rootScope', '$scope', '$routeParams', '$sce', '$localStorage', 'allianceService', 'clubService', 'matchService', function ($rootScope, $scope, $routeParams, $sce, $localStorage, allianceService, clubService, matchService) {

    $scope.ready = false;
    matchService.getAll().then(function(data) {
      console.log(data);
      $scope.matches = data.data.result;
      $scope.ready = true;
    });

    $scope.matchSearchSelected = {
      status: null,
      city: null
    };

    $scope.matchSearch = function() {
      console.log($scope.matchSearchSelected);
    }

  }]);