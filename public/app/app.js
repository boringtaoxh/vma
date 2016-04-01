'use strict';

// Declare app level module which depends on views, and components
angular.module('hshs', [
  'ngRoute',
  'ngSanitize',
  'toaster',
  'ui.mask'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { templateUrl: 'views/pages/home.html' })
      .when('/alliances', { templateUrl: 'views/pages/alliances.html' })
      .when('/alliance/:allianceId', { templateUrl: 'views/pages/alliance.html' })
      .when('/club/:clubId', { templateUrl: 'views/pages/club.html' })
      .otherwise({ redirectTo: '/'});
}]).run([
    '$rootScope',
    '$location',
    'userService',
    function ($rootScope, $location, userService) {
    }
  ]);

