alt.directive 'wrapBigProducts', ($location, $rootScope, products, toaster, $window) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: '/views/directives/wrap-big-products.html'
    scope: {
      products: '='
    }
    controller: ($scope) ->
      $window.scrollTo 0, 0
      $scope.$watch 'products', ((newVal, oldVal) ->
        $scope.productsInit = _.slice($scope.products, 0, 15)
        productsRest = _.slice($scope.products, 15)
        productsLoad = []

        $scope.loadMore = ->
          last = productsLoad.length - 1
          i = 1
          while i <= 15 && (i + last) < productsRest.length
            productsLoad.push productsRest[last + i]
            i++
          $scope.productsLoad = productsLoad
      ), true
  }