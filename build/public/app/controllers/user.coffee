alt.controller 'userCtrl', ($scope, $route, $location, $routeParams, $rootScope, auth, products, user) ->
  currentRoute = $location.path().split('/')
  $scope.sectionActive = (section) ->
    section == currentRoute[3] ? 'active' : ''
  $scope.subSectionActive = (subSection) ->
    subSection == currentRoute[4] ? 'active' : ''
  $scope.ifUnderLove = () ->
    if currentRoute[3] == 'love' then return true else return false

  $scope.userID = userID = $routeParams.userID
  user.getUser(userID).then (data) ->
    $scope.user = data
    console.log $scope.user.category

  getInfo = (data) ->
    info = []
    _.forEach data, (snapshot) ->
      if snapshot.$value == true
        info.push(_.capitalize(snapshot.$id))
    return _(info).toString().replace(/,/g, ', ')

  user.getUserFashion(userID).on 'value', (data) ->
    if data.val() == 'x' then $scope.fashion = "Man's fashion" else $scope.fashion = "Woman's fashion"
  user.getUserColour(userID).then (data) ->
    $scope.colours = getInfo data
  user.getUserCategory(userID).then (data) ->
    $scope.categories = getInfo data
  user.getUserBrand(userID).then (data) ->
    brands = []
    _.forEach data, (snapshot) ->
      if snapshot.$value != ''
        brands.push(_.capitalize(snapshot.$value))
    $scope.brands = _(brands).toString().replace(/,/g, ', ')
  user.getUserNewsletter(userID).on 'value', (data) ->
    if data.val() == true then $scope.newsletter = 'You have subscribbed to our newsletter and recommendation' else $scope.newsletter = 'You have not yet subscribbed to our newsletter and recommendation'

  $scope.userInfoUpdate = ->
    user.updateUserInfo $scope.user
    $route.reload()