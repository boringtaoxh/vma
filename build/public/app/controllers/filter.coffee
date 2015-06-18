alt.controller 'filterCtrl', ($scope, $location, $route, $routeParams, $filter, products) ->

  $scope.ready = false

  ### Route ###
  $scope.gender = $routeParams.gender
  if $routeParams.gender == 'man' then gender = 'x'
  else if $routeParams.gender == 'woman' then gender = 'y'
  else gender = 'xy'
  category = _.capitalize($routeParams.category)

  $scope.ifGender = (gender) ->
    if gender == $routeParams.gender then return true else return false
  $scope.ifCategory = (category) ->
    if category == $routeParams.category then return true else return false