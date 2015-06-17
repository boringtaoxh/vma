alt.directive 'listProducts', ($route, $location, $rootScope, products, toaster) ->
  return {
    restrict: 'AE'
    templateUrl: '/views/directives/list-products.html'
    controller: ($scope) ->
      $scope.dataURL = $rootScope.dataURL
      currentRoute = $location.path().split('/')

      $scope.flagProduct = (flagType, productID) ->
        if $rootScope.currentUser.$id != undefined
          products.flagProduct flagType, productID
        else
          $location.path '/signup'
          toaster.pop 'warning', 'Please register or log in first'

      $scope.disflagProduct = (flagType, productID) ->
        products.disflagProduct flagType, productID
        flagSection = currentRoute[4]
        if flagSection && flagSection == 'loves' || flagSection == 'reserves'
          $route.reload()

      if $rootScope.currentUser.$id != undefined
        products.getCurrentUserFlaggedProducts('love').$loaded().then (data) ->
          $scope.ifLoved = (productID) ->
            ifLoved = data.$getRecord(productID)
            if ifLoved != null then return true else return false
        products.getCurrentUserFlaggedProducts('reserve').$loaded().then (data) ->
          $scope.ifReserved = (productID) ->
            ifReserved = data.$getRecord(productID)
            if ifReserved != null then return true else return false
      
      products.getFlagCount('love').$loaded().then (data) ->
        $scope.lovesCount = (productID) ->
          lovesObj = _.where data, {'$id': productID}
          if lovesObj[0] then return lovesObj[0].$value else return '0'

      $scope.lastBought = (productID) ->
        products.lastBought productID
  }