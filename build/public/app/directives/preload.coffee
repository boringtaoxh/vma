alt.directive 'preload', ->
  return {
    restrict: 'AE'
    transclude: true
    replace: true
    templateUrl: '/views/directives/preload.html'
    link: (scope, element, attrs, ctrl, transclude) ->
    	transclude scope.$parent, (clone, scope) ->
        element.append(clone);
  }