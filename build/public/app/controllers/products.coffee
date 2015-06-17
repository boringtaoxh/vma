alt.controller 'productsCtrl', ($scope, $window, $location, $route, $routeParams, $rootScope, $timeout, auth, products, toaster) ->
  
  $scope.ready = false

  products.getRandomProducts().then (data) ->
    $scope.randomProducts = data
    $scope.ready = true
  
  products.getPreferProducts().then (data) ->
    $scope.preferProducts = data

  currentRoute = $location.path().split('/')
  if $routeParams.userID
    products.getUserFlaggedProducts(currentRoute[4], $routeParams.userID).then (data) ->
      $scope.userFlaggedProducts = data

  productID = $routeParams.productID
  if productID != undefined
    $scope.productID = productID
    products.getProduct(productID).on 'value', (data) ->
      $timeout (->
        $scope.productName = data.val().name
        $scope.productImage = data.val().image
        $scope.productBrand = data.val().brand
        $scope.productPrice = data.val().price
        $scope.productCategory = data.val().category
        $scope.productColor = _(data.val().color).toString().replace(/,/g, ', ')
        $scope.productMaterial = _(data.val().material).toString().replace(/,/g, ', ')
        $scope.productPurchace = data.val().purchace
      ), 0

  $scope.addProduct = ->
    products.addProduct $scope
    $scope.name = ''
  $scope.deleteProduct = (productID) ->
    products.deleteProduct productID

  