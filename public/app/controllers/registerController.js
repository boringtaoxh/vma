angular
  .module('hshs').controller('registerController', ['$scope', 'userService', function ($scope, userService) {

      $scope.getCaptcha = function () {
          userService.getCaptcha($scope.user);
      };

      $scope.register = function () {
          userService.register($scope.user);
      };

  }]);