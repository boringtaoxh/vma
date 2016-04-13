angular
  .module('hshs').directive('carousel', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          var options = scope.$eval($(element).attr('data-options'));
          $(element).owlCarousel(options);
      }
    };
  }).directive("ngCarousel", function() {
    return {
      restrict: 'A',
      link: function (scope) {
        scope.initCarousel = function(element) {
          var options = scope.$eval($(element).attr('data-options'));
          $(element).owlCarousel(options);
        };
      }
    };
  })
  .directive('ngCarouselItem', [function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        if(scope.$last) {
          scope.initCarousel(element.parent());
        }
      }
    };
  }]);