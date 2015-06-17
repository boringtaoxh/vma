alt.directive 'scrollTrigger', ($window) ->
  return { 
    link: (scope, element, attrs) ->
      offset = parseInt(attrs.threshold)
      e = jQuery(element[0])
      doc = jQuery(document)
      angular.element(document).bind 'scroll', ->
        if doc.scrollTop() > $(document).height() - $window.innerHeight - offset
          scope.$apply attrs.scrollTrigger
 	}