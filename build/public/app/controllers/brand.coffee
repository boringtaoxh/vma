alt.controller 'brandCtrl', ($scope, $timeout, $location, $route, $routeParams, $rootScope, $sce, auth, brand, products, toaster) ->
  currentRoute = $location.path().split('/')
  $scope.brand = $routeParams.brand
  $scope.brandChapters = ['products', 'brand', 'inspirations', 'traces']

  $scope.ready = false
  if $scope.brand
    $scope.brandData = brand.getBrand($scope.brand)
    $scope.brandData.on 'value', (data) ->
      $timeout (->
        $scope.brandName = data.val().name
        $scope.brandIntro = $sce.trustAsHtml data.val().intro
        $scope.brandTitle = data.val().title
        $scope.brandStory = $sce.trustAsHtml data.val().article
        $scope.brandProducts = brand.getBrandProducts($scope.brandName)
        $scope.brandInspirations = brand.getBrandInspirations($scope.brandName)
        $scope.brandTraces = brand.getBrandTraces($scope.brandName)
        $scope.ready = true
      ), 0
    
  if $rootScope.currentUser.$id != undefined
    $scope.followBrand = (brandID) ->
      brand.followBrand brandID
  else
    $scope.followBrand = (flagType, productID) ->
      toaster.pop 'warning', 'Please login or signup first'
      $location.path '/signup'

  $scope.unfollowBrand = (brandID) ->
    brand.unfollowBrand brandID
    if currentRoute[1] == 'user' && currentRoute[4] == 'follows'
      $route.reload()

  if $routeParams.userID
    brand.followedBrands($routeParams.userID).then (data) ->
      console.log data
      $scope.followedBrands = data

  if $rootScope.currentUser.$id != undefined
    brand.currentUserFollowedBrands().$loaded().then (data) ->
      $scope.ifFollowed = (brandID) ->
        ifFollowed = data.$getRecord(brandID)
        if ifFollowed != null then return true else return false

  $scope.chapterActive = (chapter) ->
    currentRoute = $location.path().split('/')
    chapter == currentRoute[3] ? 'active' : ''