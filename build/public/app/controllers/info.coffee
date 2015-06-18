alt.controller 'infoCtrl', ($scope, $timeout, $location, $routeParams, $rootScope, $sce, info) ->
  $scope.section = $routeParams.section

  $scope.info = info.getInfo();
  info.getInfoSection($scope.section).child('/title').on 'value', (title) ->
    $timeout (->
      $scope.infoTitle = title.val();
    ), 0
  info.getInfoSection($scope.section).child('/content').on 'value', (content) ->
    $timeout (->
      $scope.infoContent = $sce.trustAsHtml content.val();
    ), 0

  $scope.sectionActive = (section) ->
    currentRoute = $location.path().split('/')
    section == currentRoute[2] ? 'active' : ''