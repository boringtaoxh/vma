alt.directive 'listItems', ($location, $rootScope, products, toaster, $window) ->
  return {
    restrict: 'E'
    replace: true
    templateUrl: '/views/directives/list-items.html'
    scope: {
      items: '='
    }
    controller: ($scope) ->
      $scope.dataURL = $rootScope.dataURL
      $window.scrollTo 0, 0
      $scope.$watch 'items', ((newVal, oldVal) ->
        $scope.itemsInit = _.slice($scope.items, 0, 15)
        itemsRest = _.slice($scope.items, 15)
        itemsLoad = []

        $scope.loadMore = ->
          last = itemsLoad.length - 1
          i = 1
          while i <= 15 && (i + last) < itemsRest.length
            itemsLoad.push itemsRest[last + i]
            i++
          $scope.itemsLoad = itemsLoad
      ), true
  }