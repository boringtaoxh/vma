angular
  .module('hshs').controller('loginController', ['$rootScope', '$scope', 'userService', function ($rootScope, $scope, userService) {

      $scope.login = function () {
          userService.login($scope.user);
      };

      $scope.logout = function () {
        userService.logout($rootScope.currentUser.id);
      };

  }]);