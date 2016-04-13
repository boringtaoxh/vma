angular
  .module('hshs').directive('fancybox', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $(element).fancybox();
      if (scope.$last) {
        return $(".fancybox").fancybox();
      }
    }
  };
});