alt.controller 'flagsCtrl', ($scope, $routeParams, $location, $route, $rootScope, $timeout, products, toaster) ->
  currentRoute = $location.path().split('/')