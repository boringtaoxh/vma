alt.controller 'exploreCtrl', ($scope, $location, $route, $routeParams, $filter, products) ->

  $scope.ready = false

  ### Route ###
  $scope.gender = $routeParams.gender
  if $routeParams.gender == 'man' then gender = 'x'
  else if $routeParams.gender == 'woman' then gender = 'y'
  else gender = 'xy'
  category = _.capitalize($routeParams.category)

  ### Search ###
  if $location.search().colour
    $scope.colourIncludes = if _.isArray $location.search().colour then $location.search().colour else [$location.search().colour]
  else
    $scope.colourIncludes = []
  $scope.includeColour = (colour) ->
    i = _.indexOf $scope.colourIncludes, colour
    if i > -1
      $scope.colourIncludes.splice i, 1
    else
      $scope.colourIncludes.push colour
    $scope.$watch 'colourIncludes', ((newVal, oldVal) ->
      $location.search('colour', $scope.colourIncludes)
    ), true

  if $location.search().order
    $scope.orderSet = $location.search().order
  else
    $scope.orderSet = 'lovesCount'
  $scope.setOrder = (order) ->
    $scope.orderSet = order
    $scope.$watch 'orderSet', ((newVal, oldVal) ->
      $location.search('order', $scope.orderSet)
    ), true

  $scope.sortData = (data, order) ->
    switch order
      when 'priceLow'
        return _.sortByOrder data, ['price'], [true]
      when 'priceHigh'
        return _.sortByOrder data, ['price'], [false]
      when 'lastBought'
        return _.sortByOrder data, ['lastBought'], [false]
      else
        return _.sortByOrder data, ['lovesCount'], [false]

  ### Explore data ###
  products.getExploreProducts(gender, category).then (data) ->
    if $scope.colourIncludes.length > 0
      $scope.exploreProducts = data.filter (product) ->
        _.intersection(product.color, $scope.colourIncludes).length > 0
    else
      $scope.exploreProducts = data
    $scope.exploreProducts = $scope.sortData $scope.exploreProducts, $scope.orderSet
    $scope.ready = true
    ### Explore category filtering ###
    products.getExploreProducts(gender, 'All').then (data) ->
      categoryAvailable = []
      _.forEach data, (snapshot) ->
        if snapshot.category != undefined
          categoryAvailable = _.union categoryAvailable, [snapshot.category]
      $scope.ifCategoryAvailable = (category) ->
        if categoryAvailable.indexOf(category) > -1 then return true else return false
      $scope.ready = true

    ### Explore colour filtering ###
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


