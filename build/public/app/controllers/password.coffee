alt.controller 'passwordCtrl', ($scope, $route, $location, $routeParams, $rootScope, auth, products, user) ->
	$scope.resetPassword = ->
    console.log 'resetPassword'