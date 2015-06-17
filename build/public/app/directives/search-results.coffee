alt.directive 'searchResults', ->
  return {
    restrict: 'A',
    templateUrl: '/views/directives/search-results.html',
    controller: ($scope) ->
      $scope.dataURL = $rootScope.dataURL
  }