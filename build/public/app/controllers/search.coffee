alt.controller 'searchCtrl', ($scope, $routeParams, $location, products) ->
  products.getProducts().then (data) ->
    $scope.products = data

  $scope.section = $routeParams.section
  console.log $scope.section
  searchSections = [{value: "brand", text: "Brands"}, {value: "name", text: "Name"}, {value: "id", text: "Recents"}, {value: "price", text: "Price"}]
  if $scope.section != undefined
  	$scope.sectionText = _.where(searchSections, {'value': $scope.section})[0].text
  	console.log $scope.sectionText
  
  $scope.query = $location.search().target;