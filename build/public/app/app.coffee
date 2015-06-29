alt = angular.module 'alt', ['ngResource', 'ngRoute', 'toaster', 'firebase', 'ngSanitize', 'wu.masonry', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.poster', 'ng.deviceDetector']

alt.constant 'FIREBASE_URL', 'https://alovelything.firebaseio.com'

alt.run ($rootScope, $location, toaster) ->
  $rootScope.dataURL = 'http://data.a-lovely-thing.com'
  $rootScope.$on '$routeChangeError', (event, next, previous, error) ->
    if error == 'AUTH_REQUIRED'
      toaster.pop 'warning', 'Please login or signup first'
      $location.path '/signup'

alt.config ($sceDelegateProvider, $routeProvider, $locationProvider) ->
  $locationProvider.html5Mode true
  $routeProvider
  .when '/', { templateUrl: 'views/pages/index.html' }
  .when '/signup', { templateUrl: 'views/pages/user/signup.html' }
  .when '/info/:section', { templateUrl: 'views/pages/info/info.html' }
  .when '/user/:userID/love/loves', { templateUrl: 'views/pages/user/loves.html' }
  .when '/user/:userID/love/reserves', { templateUrl: 'views/pages/user/reserves.html' }
  .when '/user/:userID/love/follows', { templateUrl: 'views/pages/user/follows.html' }
  .when '/user/:userID/profile', { templateUrl: 'views/pages/user/profile.html' }
  .when '/brand/:brand/products', { 
    templateUrl: 'views/pages/brand/products.html',
    resolve :
      currentAuth: (auth) ->
        auth.requireAuth()
  }
  .when '/brand/:brand/brand', { templateUrl: 'views/pages/brand/brand.html' }
  .when '/brand/:brand/inspirations', { templateUrl: 'views/pages/brand/inspirations.html' }
  .when '/brand/:brand/traces', { templateUrl: 'views/pages/brand/traces.html' }
  .when '/search', { templateUrl: 'views/pages/search/search.html' }
  .when '/search/:section', { templateUrl: 'views/pages/search/search-section.html' }
  .when '/explore/:gender/:category', { templateUrl: 'views/pages/explore/explore.html' }
  .when '/relate', { templateUrl: 'views/pages/explore/relate.html'}
  .when '/product/:productID', { templateUrl: 'views/pages/product/product.html' }
  .otherwise { redirectTo: '/'}