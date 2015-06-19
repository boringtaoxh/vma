alt.controller 'searchCtrl', ($scope, $routeParams, $location, $timeout, products) ->

  $scope.ready = false

  products.getExploreProducts('xy', 'All').then (data) ->
    $scope.products = data
    $scope.ready = true


  $scope.section = $routeParams.section
  console.log $scope.section
  searchSections = [{value: "brand", text: "Brands"}, {value: "name", text: "Name"}, {value: "-lovesCount", text: "Loved"}, {value: "price", text: "Price"}]
  if $scope.section != undefined
    $scope.sectionText = _.where(searchSections, {'value': $scope.section})[0].text
    console.log $scope.sectionText
  
  $scope.query = $location.search().target;