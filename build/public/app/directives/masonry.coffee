alt.directive 'masonry', ($location, $rootScope, products, toaster) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: '/views/directives/wrap-products.html'
    scope: {
      products: '='
    }
    controller: ($scope, $element) ->
      currentRoute = $location.path().split('/')
      $scope.$watch 'products', ((newVal, oldVal) ->
        $scope.productsInit = _.slice($scope.products, 0, 15)
        productsRest = _.slice($scope.products, 15)
        productsLoad = []
        console.log $element
        $element.masonry {
          itemSelector: '.masonry-brick',
          isAnimated: true
        }

        $scope.loadMore = ->
          last = productsLoad.length - 1
          i = 1
          while i <= 15 && (i + last) < productsRest.length
            productsLoad.push productsRest[last + i]
            i++
          $scope.productsLoad = productsLoad
      ), true
  }