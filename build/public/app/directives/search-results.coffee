alt.directive 'searchResults', ($route, $location, $rootScope, products, toaster) ->
  return {
    restrict: 'A',
    templateUrl: '/views/directives/search-results.html',
    controller: ($scope) ->
      $scope.dataURL = $rootScope.dataURL
      $scope.lastBought = (productID) ->
        products.lastBought productID
  }