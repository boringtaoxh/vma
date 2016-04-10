angular
  .module('hshs').controller('matchesController', ['$rootScope', '$scope', '$location', '$routeParams', '$sce', '$localStorage', 'matchService', 'cityService', function ($rootScope, $scope, $location, $routeParams, $sce, $localStorage, matchService, cityService) {

    $scope.matchSearchSelected = {
      status: null,
      city: null
    };

    var status = $scope.matchSearchSelected.status;
    var city = $scope.matchSearchSelected.city;

    matchService.getAll(status, city).then(function(data) {
      console.log(data);
      $scope.matches = data.data.result;
    });

    cityService.getAll().then(function(data) {
      $scope.cities = data.data;
    });

    $scope.matchCitiesRender = function() {
      status = $scope.matchSearchSelected.status;
      city = $scope.matchSearchSelected.city;
      matchService.getAll(status, city).then(function(data) {
        $scope.matches = data.data.result;
        /*$scope.cities = _.map(data.data.result, 'city');*/
      });
    };

    /*$scope.matchSearch = function() {
      status = $scope.matchSearchSelected.status;
      city = $scope.matchSearchSelected.city;
      matchService.getAll(status, city).then(function(data) {
        $scope.matches = data.data.result;
      });
    }*/

  }]);