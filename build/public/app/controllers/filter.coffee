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

  ### Explore data ###
  products.getExploreProducts(gender, 'All').then (data) ->
    categoryAvailable = []
    _.forEach data, (snapshot) ->
      if snapshot.category != undefined
        categoryAvailable = _.union categoryAvailable, [snapshot.category]
    $scope.ifCategoryAvailable = (category) ->
      if categoryAvailable.indexOf(category) > -1 then return true else return false
    $scope.ready = true

  ### Explore data ###
  products.getExploreProducts(gender, category).then (data) ->
    colourAvailable = []
    _.forEach data, (snapshot) ->
      colourAvailable = _.union colourAvailable, snapshot.color
    $scope.ifColourAvailable = (colour) ->
      if colourAvailable.indexOf(colour) > -1 then return true else return false
    $scope.ifColourActive = (colour) ->
      if $location.search().colour
        if $location.search().colour.indexOf(colour) > -1 then return 'active' else return 'inactive'
    $scope.ifOrderActive = (order) ->
      if $location.search().order
        if $location.search().order == order then return 'active' else return 'inactive'
    $scope.ready = true