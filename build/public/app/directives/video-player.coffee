alt.directive 'videoPlayer', ($rootScope) ->
  return {
    restrict: 'A',
    templateUrl: '/views/directives/video-player.html',
    scope: 'true',
    controller: ($scope, $sce, brand, $rootScope) ->
      brand.getBrand($scope.brand).child('videoFile').on 'value', (video) ->
        $scope.brandVideo = video.val()
        brand.getBrand($scope.brand).child('videoPoster').on 'value', (poster) ->
          $scope.brandVideoPoster = poster.val()
          $scope.config =
            autoHide: true
            preload: 'none'
            sources: [
              {
                src: $sce.trustAsResourceUrl $rootScope.dataURL + '/assets/brands/' + $scope.brandVideo
                type: 'video/mp4'
              }
            ]
            theme: url: '/assets/css/videogular.css'
            plugins: {
              poster: $rootScope.dataURL + '/assets/brands/' + $scope.brandVideoPoster
            }
  }