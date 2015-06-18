alt.directive 'addthisToolbox', ->
  return {
    restrict: 'A'
    transclude: true
    replace: true
    template: '<div ng-transclude></div>'
    link: ($scope, element, attrs) ->
      addthis.init()
      addthis.toolbox $(element).get()
  }
