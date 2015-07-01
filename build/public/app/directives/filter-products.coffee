alt.directive 'filterProducts', ($timeout, $route, $location) ->
  return {
    restrict: 'A'
    controller: ($scope) ->
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
          $scope.colourIncludes = _.union $scope.colourIncludes, $location.search().colour
          $location.search('colour', $scope.colourIncludes)
          console.log $scope.exploreProducts
        ), true
  }