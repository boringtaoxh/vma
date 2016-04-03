angular
  .module('hshs').controller('headerController', ['$rootScope', '$scope', '$routeParams', '$location', function ($rootScope, $scope, $routeParams, $location) {
    var currentRoute = $location.path().split('/');

    $scope.setActive = function(menuItem) {
      console.log(menuItem);
      return menuItem == currentRoute[1] ? "active" : "";
    }

  }]);