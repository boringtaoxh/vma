alt.controller 'indexCtrl', ($scope, $location, $window, deviceDetector) ->
  if deviceDetector.device == 'iphone' && window.screen.availWidth <= 414
    $scope.mobileView = true
  else
    $scope.mobileView = false

  if $scope.mobileView
    $window.location.href = 'http://m-en.a-lovely-thing.com'

  