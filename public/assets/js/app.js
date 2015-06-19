var alt;

alt = angular.module('alt', ['ngResource', 'ngRoute', 'toaster', 'firebase', 'ngSanitize', 'wu.masonry', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.poster', 'angular-preload-image']);

alt.constant('FIREBASE_URL', 'https://alovelything.firebaseio.com');

alt.run(function($rootScope, $location, toaster) {
  $rootScope.dataURL = 'http://data.a-lovely-thing.com';
  return $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
    if (error === 'AUTH_REQUIRED') {
      toaster.pop('warning', 'Please login or signup first');
      return $location.path('/signup');
    }
  });
});

alt.config(function($sceDelegateProvider, $routeProvider, $locationProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://data.a-lovely-thing.com/**']);
  $locationProvider.html5Mode(true);
  return $routeProvider.when('/', {
    templateUrl: 'views/pages/index.html'
  }).when('/signup', {
    templateUrl: 'views/pages/user/signup.html'
  }).when('/info/:section', {
    templateUrl: 'views/pages/info/info.html'
  }).when('/user/:userID/love/loves', {
    templateUrl: 'views/pages/user/loves.html'
  }).when('/user/:userID/love/reserves', {
    templateUrl: 'views/pages/user/reserves.html'
  }).when('/user/:userID/love/follows', {
    templateUrl: 'views/pages/user/follows.html'
  }).when('/user/:userID/profile', {
    templateUrl: 'views/pages/user/profile.html'
  }).when('/brand/:brand/products', {
    templateUrl: 'views/pages/brand/products.html',
    resolve: {
      currentAuth: function(auth) {
        return auth.requireAuth();
      }
    }
  }).when('/brand/:brand/brand', {
    templateUrl: 'views/pages/brand/brand.html'
  }).when('/brand/:brand/inspirations', {
    templateUrl: 'views/pages/brand/inspirations.html'
  }).when('/brand/:brand/traces', {
    templateUrl: 'views/pages/brand/traces.html'
  }).when('/search', {
    templateUrl: 'views/pages/search/search.html'
  }).when('/search/:section', {
    templateUrl: 'views/pages/search/search-section.html'
  }).when('/explore/:gender/:category', {
    templateUrl: 'views/pages/explore/explore.html'
  }).when('/relate', {
    templateUrl: 'views/pages/explore/relate.html'
  }).when('/product/:productID', {
    templateUrl: 'views/pages/product/product.html'
  }).otherwise({
    redirectTo: '/'
  });
});

alt.controller('authCtrl', function($scope, $route, $location, auth, toaster) {
  $scope.login = function() {
    return auth.login($scope.user).then(function(data) {
      $location.path('/');
      toaster.pop('success', 'Successfully login');
      return $route.reload();
    })["catch"](function(error) {
      switch (error.code) {
        case 'INVALID_USER':
          return toaster.pop('warning', 'Invalid user email');
        case 'INVALID_PASSWORD':
          return toaster.pop('warning', 'Invalid password');
        default:
          return toaster.pop('warning', error);
      }
    });
  };
  $scope.logout = function() {
    auth.logout();
    toaster.pop('success', 'Successfully logout');
  };
  return $scope.register = function() {
    auth.register($scope.user).then(function(data) {
      auth.storeUserInfo($scope.user, data);
      toaster.pop('success', 'Successfully registered');
      return auth.login($scope.user).then(function(data) {
        $location.path('/');
        toaster.pop('success', 'Successfully login');
        return $route.reload();
      });
    })["catch"](function(error) {
      switch (error.code) {
        case 'EMAIL_TAKEN':
          return toaster.pop('warning', 'Email has been taken');
        default:
          return toaster.pop('warning', error);
      }
    });
  };
});

alt.controller('brandCtrl', function($scope, $timeout, $location, $route, $routeParams, $rootScope, $sce, auth, brand, products, toaster) {
  var currentRoute;
  currentRoute = $location.path().split('/');
  $scope.brand = $routeParams.brand;
  console.log($scope.brand);
  $scope.brandChapters = ['products', 'brand', 'inspirations', 'traces'];
  $scope.ready = false;
  if ($scope.brand) {
    $scope.brandData = brand.getBrand($scope.brand);
    $scope.brandData.on('value', function(data) {
      return $timeout((function() {
        $scope.brandName = data.val().name;
        $scope.brandIntro = $sce.trustAsHtml(data.val().intro);
        $scope.brandTitle = data.val().title;
        $scope.brandStory = $sce.trustAsHtml(data.val().article);
        $scope.brandProducts = brand.getBrandProducts($scope.brandName);
        $scope.brandInspirations = brand.getBrandInspirations($scope.brandName);
        $scope.brandTraces = brand.getBrandTraces($scope.brandName);
        return $scope.ready = true;
      }), 0);
    });
  }
  if ($rootScope.currentUser !== void 0) {
    $scope.followBrand = function(brandID) {
      return brand.followBrand(brandID);
    };
  } else {
    $scope.followBrand = function(flagType, productID) {
      toaster.pop('warning', 'Please login or signup first');
      return $location.path('/signup');
    };
  }
  $scope.unfollowBrand = function(brandID) {
    brand.unfollowBrand(brandID);
    if (currentRoute[1] === 'user' && currentRoute[4] === 'follows') {
      return $route.reload();
    }
  };
  if ($routeParams.userID) {
    brand.followedBrands($routeParams.userID).then(function(data) {
      console.log(data);
      return $scope.followedBrands = data;
    });
  }
  if ($rootScope.currentUser !== void 0) {
    brand.currentUserFollowedBrands().$loaded().then(function(data) {
      return $scope.ifFollowed = function(brandID) {
        var ifFollowed;
        ifFollowed = data.$getRecord(brandID);
        if (ifFollowed !== null) {
          return true;
        } else {
          return false;
        }
      };
    });
  }
  return $scope.chapterActive = function(chapter) {
    var ref;
    currentRoute = $location.path().split('/');
    return (ref = chapter === currentRoute[3]) != null ? ref : {
      'active': ''
    };
  };
});

alt.controller('exploreCtrl', function($scope, $location, $route, $routeParams, $filter, $timeout, products) {
  var category, gender;
  $scope.ready = false;

  /* Route */
  $scope.gender = $routeParams.gender;
  if ($routeParams.gender === 'man') {
    gender = 'x';
  } else if ($routeParams.gender === 'woman') {
    gender = 'y';
  } else {
    gender = 'xy';
  }
  category = _.capitalize($routeParams.category);

  /* Search */
  if ($location.search().colour) {
    $scope.colourIncludes = _.isArray($location.search().colour) ? $location.search().colour : [$location.search().colour];
  } else {
    $scope.colourIncludes = [];
  }
  $scope.includeColour = function(colour) {
    var i;
    i = _.indexOf($scope.colourIncludes, colour);
    if (i > -1) {
      $scope.colourIncludes.splice(i, 1);
    } else {
      $scope.colourIncludes.push(colour);
    }
    return $scope.$watch('colourIncludes', (function(newVal, oldVal) {
      return $location.search('colour', $scope.colourIncludes);
    }), true);
  };
  if ($location.search().order) {
    $scope.orderSet = $location.search().order;
  } else {
    $scope.orderSet = 'random';
  }
  $scope.setOrder = function(order) {
    $scope.orderSet = order;
    return $scope.$watch('orderSet', (function(newVal, oldVal) {
      return $location.search('order', $scope.orderSet);
    }), true);
  };
  $scope.sortData = function(data, order) {
    switch (order) {
      case 'priceLow':
        return _.sortByOrder(data, ['price'], [true]);
      case 'priceHigh':
        return _.sortByOrder(data, ['price'], [false]);
      case 'lastBought':
        return _.sortByOrder(data, ['lastBought'], [false]);
      case 'lovesCount':
        return _.sortByOrder(data, ['lovesCount'], [false]);
      default:
        return _.shuffle(data);
    }
  };

  /* Explore data */
  products.getExploreProducts(gender, category).then(function(data) {
    if ($scope.colourIncludes.length > 0) {
      $scope.exploreProducts = data.filter(function(product) {
        return _.intersection(product.color, $scope.colourIncludes).length > 0;
      });
    } else {
      $scope.exploreProducts = data;
      $scope.exploreProducts = $scope.sortData($scope.exploreProducts, $scope.orderSet);
    }
    return $scope.ready = true;
  });

  /* Explore category filtering */
  products.getExploreProducts(gender, 'All').then(function(data) {
    var categoryAvailable;
    categoryAvailable = [];
    _.forEach(data, function(snapshot) {
      if (snapshot.category !== void 0) {
        return categoryAvailable = _.union(categoryAvailable, [snapshot.category]);
      }
    });
    return $scope.ifCategoryAvailable = function(category) {
      if (categoryAvailable.indexOf(category) > -1) {
        return true;
      } else {
        return false;
      }
    };
  });

  /* Explore colour filtering */
  return products.getExploreProducts(gender, category).then(function(data) {
    var colourAvailable;
    colourAvailable = [];
    _.forEach(data, function(snapshot) {
      return colourAvailable = _.union(colourAvailable, snapshot.color);
    });
    $scope.ifColourAvailable = function(colour) {
      if (colourAvailable.indexOf(colour) > -1) {
        return true;
      } else {
        return false;
      }
    };
    $scope.ifColourActive = function(colour) {
      if ($location.search().colour) {
        if ($location.search().colour.indexOf(colour) > -1) {
          return 'active';
        } else {
          return 'inactive';
        }
      }
    };
    return $scope.ifOrderActive = function(order) {
      if ($location.search().order) {
        if ($location.search().order === order) {
          return 'active';
        } else {
          return 'inactive';
        }
      }
    };
  });
});

alt.controller('filterCtrl', function($scope, $location, $route, $routeParams, $filter, products) {
  var category, gender;
  $scope.ready = false;

  /* Route */
  $scope.gender = $routeParams.gender;
  if ($routeParams.gender === 'man') {
    gender = 'x';
  } else if ($routeParams.gender === 'woman') {
    gender = 'y';
  } else {
    gender = 'xy';
  }
  category = _.capitalize($routeParams.category);
  $scope.ifGender = function(gender) {
    if (gender === $routeParams.gender) {
      return true;
    } else {
      return false;
    }
  };
  return $scope.ifCategory = function(category) {
    if (category === $routeParams.category) {
      return true;
    } else {
      return false;
    }
  };
});

alt.controller('flagsCtrl', function($scope, $routeParams, $location, $route, $rootScope, $timeout, products, toaster) {
  var currentRoute;
  return currentRoute = $location.path().split('/');
});

alt.controller('footerCtrl', function($scope, $route, $location, auth, toaster) {
  return $scope.hideFollow = true;
});

alt.controller('infoCtrl', function($scope, $timeout, $location, $routeParams, $rootScope, $sce, info) {
  $scope.section = $routeParams.section;
  $scope.info = info.getInfo();
  info.getInfoSection($scope.section).child('/title').on('value', function(title) {
    return $timeout((function() {
      return $scope.infoTitle = title.val();
    }), 0);
  });
  info.getInfoSection($scope.section).child('/content').on('value', function(content) {
    return $timeout((function() {
      return $scope.infoContent = $sce.trustAsHtml(content.val());
    }), 0);
  });
  return $scope.sectionActive = function(section) {
    var currentRoute, ref;
    currentRoute = $location.path().split('/');
    return (ref = section === currentRoute[2]) != null ? ref : {
      'active': ''
    };
  };
});

alt.controller('productsCtrl', function($scope, $window, $location, $route, $routeParams, $rootScope, $timeout, auth, products, toaster) {
  var currentRoute, productID;
  $scope.ready = false;
  products.getRandomProducts().then(function(data) {
    $scope.randomProducts = data;
    return $scope.ready = true;
  });
  products.getPreferProducts().then(function(data) {
    return $scope.preferProducts = data;
  });
  currentRoute = $location.path().split('/');
  if ($routeParams.userID) {
    products.getUserFlaggedProducts(currentRoute[4], $routeParams.userID).then(function(data) {
      return $scope.userFlaggedProducts = data;
    });
  }
  productID = $routeParams.productID;
  if (productID !== void 0) {
    $scope.productID = productID;
    products.getProduct(productID).on('value', function(data) {
      return $timeout((function() {
        $scope.productName = data.val().name;
        $scope.productImage = data.val().image;
        $scope.productBrand = data.val().brand;
        $scope.productPrice = data.val().price;
        $scope.productCategory = data.val().category;
        $scope.productColor = _(data.val().color).toString().replace(/,/g, ', ');
        $scope.productMaterial = _(data.val().material).toString().replace(/,/g, ', ');
        return $scope.productPurchace = data.val().purchace;
      }), 0);
    });
  }
  $scope.addProduct = function() {
    products.addProduct($scope);
    return $scope.name = '';
  };
  return $scope.deleteProduct = function(productID) {
    return products.deleteProduct(productID);
  };
});

alt.controller('searchCtrl', function($scope, $routeParams, $location, $timeout, products) {
  var searchSections;
  $scope.ready = false;
  products.getExploreProducts('xy', 'All').then(function(data) {
    $scope.products = data;
    return $scope.ready = true;
  });
  $scope.section = $routeParams.section;
  console.log($scope.section);
  searchSections = [
    {
      value: "brand",
      text: "Brands"
    }, {
      value: "name",
      text: "Name"
    }, {
      value: "-lovesCount",
      text: "Loved"
    }, {
      value: "price",
      text: "Price"
    }
  ];
  if ($scope.section !== void 0) {
    $scope.sectionText = _.where(searchSections, {
      'value': $scope.section
    })[0].text;
    console.log($scope.sectionText);
  }
  return $scope.query = $location.search().target;
});

alt.controller('userCtrl', function($scope, $route, $location, $routeParams, $rootScope, auth, products, user) {
  var currentRoute, getInfo, userID;
  $scope.dataURL = $rootScope.dataURL;
  currentRoute = $location.path().split('/');
  $scope.sectionActive = function(section) {
    var ref;
    return (ref = section === currentRoute[3]) != null ? ref : {
      'active': ''
    };
  };
  $scope.subSectionActive = function(subSection) {
    var ref;
    return (ref = subSection === currentRoute[4]) != null ? ref : {
      'active': ''
    };
  };
  $scope.ifUnderLove = function() {
    if (currentRoute[3] === 'love') {
      return true;
    } else {
      return false;
    }
  };
  $scope.userID = userID = $routeParams.userID;
  user.getUser(userID).then(function(data) {
    $scope.user = data;
    return console.log($scope.user.category);
  });
  getInfo = function(data) {
    var info;
    info = [];
    _.forEach(data, function(snapshot) {
      if (snapshot.$value === true) {
        return info.push(_.capitalize(snapshot.$id));
      }
    });
    return _(info).toString().replace(/,/g, ', ');
  };
  user.getUserFashion(userID).on('value', function(data) {
    if (data.val() === 'x') {
      return $scope.fashion = "Man's fashion";
    } else {
      return $scope.fashion = "Woman's fashion";
    }
  });
  user.getUserColour(userID).then(function(data) {
    return $scope.colours = getInfo(data);
  });
  user.getUserCategory(userID).then(function(data) {
    return $scope.categories = getInfo(data);
  });
  user.getUserBrand(userID).then(function(data) {
    var brands;
    brands = [];
    _.forEach(data, function(snapshot) {
      if (snapshot.$value !== '') {
        return brands.push(_.capitalize(snapshot.$value));
      }
    });
    return $scope.brands = _(brands).toString().replace(/,/g, ', ');
  });
  user.getUserNewsletter(userID).on('value', function(data) {
    if (data.val() === true) {
      return $scope.newsletter = 'You have subscribbed to our newsletter and recommendation';
    } else {
      return $scope.newsletter = 'You have not yet subscribbed to our newsletter and recommendation';
    }
  });
  return $scope.userInfoUpdate = function() {
    user.updateUserInfo($scope.user);
    return $route.reload();
  };
});

alt.filter('charactersRemove', function() {
  return function(value) {
    if (!value) {
      return '';
    } else {
      return value.replace(/[^\w]/g, '');
    }
  };
});

alt.filter('colourFilter', function($location) {
  return function(products, scope) {
    if (scope.colourIncludes.length > 0 && products) {
      return products = products.filter(function(product) {
        return _.intersection(product.color, scope.colourIncludes).length > 0;
      });
    } else {
      return products;
    }
  };
});

alt.filter('trustedDomain', function($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

alt.filter('wordsTrunc', function() {
  return function(value, max) {
    if (!value) {
      return '';
    }
    max = parseInt(max, 20);
    if (!max || value.length <= max) {
      return value;
    } else {
      return value.substr(0, max) + ' …';
    }
  };
});

alt.factory('auth', function($rootScope, FIREBASE_URL, $firebaseAuth, $firebaseObject) {
  var authRef, output, rootRef;
  rootRef = new Firebase(FIREBASE_URL);
  authRef = $firebaseAuth(rootRef);
  authRef.$onAuth(function(authUser) {
    var userObj, userRef;
    if (authUser) {
      userRef = new Firebase(FIREBASE_URL + '/users/' + authUser.uid);
      userObj = $firebaseObject(userRef);
      return $rootScope.currentUser = userObj;
    } else {
      return $rootScope.currentUser = '';
    }
  });
  output = {
    login: function(userObj) {
      return authRef.$authWithPassword(userObj);
    },
    logout: function() {
      return authRef.$unauth();
    },
    register: function(userObj) {
      return authRef.$createUser(userObj);
    },
    storeUserInfo: function(userObj, regUser) {
      var userInfo, usersRef;
      usersRef = new Firebase(FIREBASE_URL + '/users');
      if (userObj.newsletter === void 0) {
        userObj.newsletter = false;
      }
      userInfo = {
        uid: regUser.uid,
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        username: '',
        email: userObj.email,
        fashion: userObj.fashion,
        newsletter: userObj.newsletter,
        address: '',
        colour: '',
        category: '',
        brand: '',
        loves: '',
        follows: '',
        reserves: '',
        date: Firebase.ServerValue.TIMESTAMP
      };
      usersRef.child(regUser.uid).set(userInfo, function() {
        return console.log(userInfo);
      });
    },
    requireAuth: function() {
      return authRef.$requireAuth();
    },
    getCurrentUser: function(uid) {
      var userRef;
      userRef = new Firebase(FIREBASE_URL + '/users/' + uid);
      return $firebaseObject(userRef);
    }
  };
  return output;
});

alt.factory('brand', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var brandsRef, flagsRef, inspirationsRef, output, productsRef, statsRef, tracesRef, usersRef;
  brandsRef = new Firebase(FIREBASE_URL + '/brands');
  productsRef = new Firebase(FIREBASE_URL + '/products');
  inspirationsRef = new Firebase(FIREBASE_URL + '/inspirations');
  tracesRef = new Firebase(FIREBASE_URL + '/traces');
  usersRef = new Firebase(FIREBASE_URL + '/users');
  statsRef = new Firebase(FIREBASE_URL + '/stats');
  flagsRef = new Firebase(FIREBASE_URL + '/flags');
  output = {
    getBrand: function(brand) {
      return brandsRef.child(brand);
    },
    getBrandProducts: function(brand) {
      return $firebaseArray(productsRef.orderByChild('brand').equalTo(brand));
    },
    getBrandInspirations: function(brand) {
      return $firebaseArray(inspirationsRef.orderByChild('brand').equalTo(brand));
    },
    getBrandTraces: function(brand) {
      return $firebaseArray(tracesRef.orderByChild('brand').equalTo(brand));
    },
    followBrand: function(brand) {
      var brandFollowedRef, followInfo, followedCountArray, followedCountRef, userFollowsRef;
      brandFollowedRef = flagsRef.child('follows').child(brand);
      followedCountRef = statsRef.child('followsCount').child(brand);
      followedCountArray = $firebaseArray(brandFollowedRef);
      followInfo = {
        date: Firebase.ServerValue.TIMESTAMP
      };
      brandFollowedRef.child($rootScope.currentUser.$id).set(followInfo, function() {
        console.log('Follow added to brand');
        return followedCountRef.set(followedCountArray.length, function() {
          return console.log('Follows counted');
        });
      });
      userFollowsRef = usersRef.child($rootScope.currentUser.$id).child('follows');
      return userFollowsRef.child(brand).set(followInfo, function() {
        return console.log('Follow added to user');
      });
    },
    unfollowBrand: function(brand) {
      var brandFollowedRef, followedCountArray, followedCountRef, followsRefUser;
      brandFollowedRef = flagsRef.child('follows').child(brand);
      followedCountRef = statsRef.child('followsCount').child(brand);
      followedCountArray = $firebaseArray(brandFollowedRef);
      brandFollowedRef.child($rootScope.currentUser.$id).remove(function() {
        console.log('Follow removed from brand');
        return followedCountRef.set(followedCountArray.length, function() {
          return console.log('Follows counted');
        });
      });
      followsRefUser = usersRef.child($rootScope.currentUser.$id).child('follows').child(brand);
      return followsRefUser.remove(function() {
        return console.log('Follow removed from user');
      });
    },
    followedBrands: function(userID) {
      var followedBrands, followedBrandsArray, followedBrandsRef, promise;
      followedBrands = [];
      followedBrandsRef = usersRef.child(userID).child('follows');
      followedBrandsArray = $firebaseArray(followedBrandsRef);
      promise = followedBrandsArray.$loaded(function(data) {
        _.forEach(data, function(snapshot) {
          var followedBrandObj;
          followedBrandObj = $firebaseObject(brandsRef.child(snapshot.$id));
          return followedBrands.push(followedBrandObj);
        });
        return followedBrands;
      });
      return promise;
    },
    currentUserFollowedBrands: function() {
      var currentUserFollowedBrandsRef;
      currentUserFollowedBrandsRef = usersRef.child($rootScope.currentUser.$id).child('follows');
      return $firebaseArray(currentUserFollowedBrandsRef);
    }
  };
  return output;
});

alt.factory('info', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var infoRef, output;
  infoRef = new Firebase(FIREBASE_URL + '/info');
  output = {
    getInfo: function() {
      return $firebaseArray(infoRef.orderByChild('order'));
    },
    getInfoSection: function(section) {
      return infoRef.child(section);
    }
  };
  return output;
});

alt.factory('products', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject, auth) {
  var flagsRef, output, productsArray, productsRef, statsRef, usersRef;
  productsRef = new Firebase(FIREBASE_URL + '/products');
  productsArray = $firebaseArray(productsRef);
  usersRef = new Firebase(FIREBASE_URL + '/users');
  statsRef = new Firebase(FIREBASE_URL + '/stats');
  flagsRef = new Firebase(FIREBASE_URL + '/flags');
  output = {
    getProducts: function() {
      var promise;
      promise = productsArray.$loaded(function(data) {
        return data;
      });
      return promise;
    },
    getRandomProducts: function() {
      var promise;
      promise = productsArray.$loaded(function(data) {
        return _.shuffle(data);
      });
      return promise;
    },
    getPreferProducts: function() {
      var promise;
      promise = productsArray.$loaded(function(productsData) {
        return auth.getCurrentUser($rootScope.currentUser.$id).$loaded().then(function(userData) {
          var products;
          products = _.where(productsData, {
            'gender': [userData.fashion]
          });
          return _.shuffle(products);
        });
      });
      return promise;
    },
    getExploreProducts: function(gender, category) {
      var promise;
      promise = productsArray.$loaded(function(data) {
        var products;
        if (gender === 'x' || gender === 'y') {
          products = _.where(data, {
            'gender': [gender]
          });
        } else {
          products = data;
        }
        if (category !== 'All') {
          products = _.where(products, {
            'category': category
          });
        }
        _.forEach(products, function(value, key) {
          _.extend(products[key], {
            lovesCount: 0
          });
          statsRef.child('lovesCount').child(value.$id).on('value', function(data) {
            if (data.val() !== null && data.val() !== 0) {
              return products[key].lovesCount = data.val();
            }
          });
          _.extend(products[key], {
            lastBought: 0
          });
          return flagsRef.child('bought').child(value.$id).on('value', function(data) {
            if (data.val() !== null && data.val() !== 0) {
              return products[key].lastBought = data.val();
            }
          });
        });
        return products;
      });
      return promise;
    },
    getRelateProducts: function(look) {
      var promise;
      promise = productsArray.$loaded(function(data) {
        var products;
        products = _.where(data, {
          'relate': look
        });
        return products;
      });
      return promise;
    },
    getProduct: function(productID) {
      return productsRef.child(productID);
    },
    addProduct: function(product) {
      var productInfo;
      productInfo = {
        name: product.name,
        date: Firebase.ServerValue.TIMESTAMP
      };
      return productsRef.push(productInfo, function() {
        return console.log('Product added');
      });
    },
    deleteProduct: function(productID) {
      var productRef;
      productRef = productsRef.child(productID);
      return productRef.child('loves').on('value', function(users) {
        if (users.val() !== null) {
          return users.forEach(function(user) {
            usersRef.child(user.key()).child('loves').child(productID).remove(function() {
              return console.log('Love removed from user');
            });
            return productRef.remove(function() {
              return console.log('Product deleted');
            });
          });
        } else {
          return productRef.remove(function() {
            return console.log('Product deleted');
          });
        }
      });
    },
    flagProduct: function(flagType, productID) {
      var flagCountArray, flagCountStatsRef, flagInfo, productFlagRef, userFlagRef;
      productFlagRef = flagsRef.child(flagType + 's').child(productID);
      flagCountArray = $firebaseArray(productFlagRef);
      flagCountStatsRef = statsRef.child(flagType + 'sCount').child(productID);
      flagInfo = {
        date: Firebase.ServerValue.TIMESTAMP
      };
      productFlagRef.child($rootScope.currentUser.$id).set(flagInfo, function() {
        console.log(productID + ' ' + flagType + ' added to Flags');
        return flagCountStatsRef.set(flagCountArray.length, function() {
          return console.log(flagType + ' counted in Stats');
        });
      });
      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's');
      return userFlagRef.child(productID).set(flagInfo, function() {
        return console.log(flagType + ' added to user');
      });
    },
    disflagProduct: function(flagType, productID) {
      var flagCountArray, flagCountStatsRef, productFlagRef, userFlagRef;
      productFlagRef = flagsRef.child(flagType + 's').child(productID);
      flagCountArray = $firebaseArray(productFlagRef);
      flagCountStatsRef = statsRef.child(flagType + 'sCount').child(productID);
      productFlagRef.child($rootScope.currentUser.$id).remove(function() {
        console.log(flagType + ' removed from Flags');
        if (flagCountArray.length > 0) {
          return flagCountStatsRef.set(flagCountArray.length, function() {
            return console.log(flagType + ' counted in Stats');
          });
        } else {
          return flagCountStatsRef.remove(function() {
            return console.log(flagType + ' removed in Stats');
          });
        }
      });
      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's').child(productID);
      return userFlagRef.remove(function() {
        return console.log(flagType + ' removed from user');
      });
    },
    getFlagCount: function(flagType) {
      return $firebaseArray(statsRef.child(flagType + 'sCount'));
    },
    getUserFlaggedProducts: function(flagSection, userID) {
      var flaggedProducts, flaggedProductsArray, flaggedProductsRef, promise;
      flaggedProducts = [];
      flaggedProductsRef = usersRef.child(userID).child(flagSection);
      flaggedProductsArray = $firebaseArray(flaggedProductsRef);
      promise = flaggedProductsArray.$loaded(function(data) {
        _.forEach(data, function(snapshot) {
          var flaggedProductObj;
          flaggedProductObj = $firebaseObject(productsRef.child(snapshot.$id));
          return flaggedProducts.push(flaggedProductObj);
        });
        return flaggedProducts;
      });
      return promise;
    },
    getCurrentUserFlaggedProducts: function(flagType) {
      var currentUserFlaggedProductsRef;
      currentUserFlaggedProductsRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's');
      return $firebaseArray(currentUserFlaggedProductsRef);
    },
    lastBought: function(productID) {
      var flagInfo, productFlagRef;
      productFlagRef = flagsRef.child('bought').child(productID);
      flagInfo = Firebase.ServerValue.TIMESTAMP;
      return productFlagRef.set(flagInfo, function() {
        return console.log(productID + ' bought added to Flags');
      });
    }
  };
  return output;
});

alt.factory('user', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject, $routeParams) {
  var output, product, usersRef;
  usersRef = new Firebase(FIREBASE_URL + '/users');
  product = function(userID) {
    return $firebaseObject(productsRef.child(userID));
  };
  output = {
    getUser: function(user) {
      var promise, userObject;
      userObject = $firebaseObject(usersRef.child(user));
      promise = userObject.$loaded(function(data) {
        return data;
      });
      return promise;
    },
    getUserColour: function(user) {
      var colourArray, promise;
      colourArray = $firebaseArray(usersRef.child(user).child('colour'));
      promise = colourArray.$loaded(function(data) {
        return data;
      });
      return promise;
    },
    getUserCategory: function(user) {
      var categoryArray, promise;
      categoryArray = $firebaseArray(usersRef.child(user).child('category'));
      promise = categoryArray.$loaded(function(data) {
        return data;
      });
      return promise;
    },
    getUserBrand: function(user) {
      var brandArray, promise;
      brandArray = $firebaseArray(usersRef.child(user).child('brand'));
      promise = brandArray.$loaded(function(data) {
        return data;
      });
      return promise;
    },
    getUserFashion: function(user) {
      return usersRef.child(user).child('fashion');
    },
    getUserNewsletter: function(user) {
      return usersRef.child(user).child('newsletter');
    },
    updateUserInfo: function(user) {
      var editedUser, userID;
      if (user !== void 0) {
        userID = $routeParams.userID;
        editedUser = $firebaseObject(usersRef.child(userID));
        editedUser.$loaded(function(data) {
          var address, brand, category, colour, fashion, firstname, follows, lastname, loves, newsletter, reserves, userInfo, username;
          if (user.firstname === '') {
            firstname = data.firstname;
          } else {
            firstname = user.firstname;
          }
          if (user.lastname === '') {
            lastname = data.lastname;
          } else {
            lastname = user.lastname;
          }
          if (user.username === '') {
            username = data.username;
          } else {
            username = user.username;
          }
          if (user.address === '') {
            address = data.address;
          } else {
            address = user.address;
          }
          if (user.fashion === '') {
            fashion = data.fashion;
          } else {
            fashion = user.fashion;
          }
          if (user.colour === '') {
            colour = data.colour;
          } else {
            colour = user.colour;
          }
          if (user.category === '') {
            category = data.category;
          } else {
            category = user.category;
          }
          if (user.brand === '') {
            brand = data.brand;
          } else {
            brand = user.brand;
          }
          if (user.newsletter === '') {
            newsletter = data.newsletter;
          } else {
            newsletter = user.newsletter;
          }
          if (data.loves === void 0) {
            loves = '';
          } else {
            loves = data.loves;
          }
          if (data.follows === void 0) {
            follows = '';
          } else {
            follows = data.follows;
          }
          if (data.reserves === void 0) {
            reserves = '';
          } else {
            reserves = data.reserves;
          }
          userInfo = {
            uid: data.uid,
            date: data.date,
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: data.email,
            address: address,
            fashion: fashion,
            colour: colour,
            category: category,
            brand: brand,
            newsletter: newsletter,
            loves: loves,
            follows: follows,
            reserves: reserves
          };
          return usersRef.child(user.$id).set(userInfo, function() {});
        });
      }
    }
  };
  return output;
});



alt.directive('addthisToolbox', function() {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div ng-transclude></div>',
    link: function($scope, element, attrs) {
      addthis.init();
      return addthis.toolbox($(element).get());
    }
  };
});

alt.directive('adminProducts', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/admin-products.html',
    scope: true,
    controller: function($scope) {
      $scope.deleting = false;
      $scope.startDelete = function() {
        return $scope.deleting = true;
      };
      return $scope.cancelDelete = function() {
        return $scope.deleting = false;
      };
    }
  };
});

alt.directive('fancybox', function() {
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

alt.directive('filterProducts', function($timeout, $route, $location) {
  return {
    restrict: 'A',
    controller: function($scope) {
      if ($location.search().colour) {
        $scope.colourIncludes = _.isArray($location.search().colour) ? $location.search().colour : [$location.search().colour];
      } else {
        $scope.colourIncludes = [];
      }
      return $scope.includeColour = function(colour) {
        var i;
        i = _.indexOf($scope.colourIncludes, colour);
        if (i > -1) {
          $scope.colourIncludes.splice(i, 1);
        } else {
          $scope.colourIncludes.push(colour);
        }
        return $scope.$watch('colourIncludes', (function(newVal, oldVal) {
          $scope.colourIncludes = _.union($scope.colourIncludes, $location.search().colour);
          $location.search('colour', $scope.colourIncludes);
          return console.log($scope.exploreProducts);
        }), true);
      };
    },
    link: function(scope, el, attrs) {
      return $('.filter-button.order').click(function() {
        $('.filter-button.order').removeClass('active');
        return $(this).addClass('active');
      });
    }
  };
});

alt.directive('listItems', function($location, $rootScope, products, toaster, $window) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/list-items.html',
    scope: {
      items: '='
    },
    controller: function($scope) {
      $scope.dataURL = $rootScope.dataURL;
      $window.scrollTo(0, 0);
      return $scope.$watch('items', (function(newVal, oldVal) {
        var itemsLoad, itemsRest;
        $scope.itemsInit = _.slice($scope.items, 0, 12);
        itemsRest = _.slice($scope.items, 12);
        itemsLoad = [];
        return $scope.loadMore = function() {
          var i, last;
          last = itemsLoad.length - 1;
          i = 1;
          while (i <= 12 && (i + last) < itemsRest.length) {
            itemsLoad.push(itemsRest[last + i]);
            i++;
          }
          return $scope.itemsLoad = itemsLoad;
        };
      }), true);
    }
  };
});

alt.directive('listProducts', function($route, $location, $rootScope, products, toaster) {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/list-products.html',
    controller: function($scope) {
      var currentRoute;
      $scope.dataURL = $rootScope.dataURL;
      currentRoute = $location.path().split('/');
      $scope.flagProduct = function(flagType, productID) {
        if ($rootScope.currentUser.$id !== void 0) {
          return products.flagProduct(flagType, productID);
        } else {
          $location.path('/signup');
          return toaster.pop('warning', 'Please register or log in first');
        }
      };
      $scope.disflagProduct = function(flagType, productID) {
        var flagSection;
        products.disflagProduct(flagType, productID);
        flagSection = currentRoute[4];
        if (flagSection && flagSection === 'loves' || flagSection === 'reserves') {
          return $route.reload();
        }
      };
      if ($rootScope.currentUser.$id !== void 0) {
        products.getCurrentUserFlaggedProducts('love').$loaded().then(function(data) {
          return $scope.ifLoved = function(productID) {
            var ifLoved;
            ifLoved = data.$getRecord(productID);
            if (ifLoved !== null) {
              return true;
            } else {
              return false;
            }
          };
        });
        products.getCurrentUserFlaggedProducts('reserve').$loaded().then(function(data) {
          return $scope.ifReserved = function(productID) {
            var ifReserved;
            ifReserved = data.$getRecord(productID);
            if (ifReserved !== null) {
              return true;
            } else {
              return false;
            }
          };
        });
      }
      products.getFlagCount('love').$loaded().then(function(data) {
        return $scope.lovesCount = function(productID) {
          var lovesObj;
          lovesObj = _.where(data, {
            '$id': productID
          });
          if (lovesObj[0]) {
            return lovesObj[0].$value;
          } else {
            return '0';
          }
        };
      });
      return $scope.lastBought = function(productID) {
        return products.lastBought(productID);
      };
    }
  };
});

alt.directive('masonry', function($location, $rootScope, products, toaster) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/wrap-products.html',
    scope: {
      products: '='
    },
    controller: function($scope, $element) {
      var currentRoute;
      currentRoute = $location.path().split('/');
      return $scope.$watch('products', (function(newVal, oldVal) {
        var productsLoad, productsRest;
        $scope.productsInit = _.slice($scope.products, 0, 15);
        productsRest = _.slice($scope.products, 15);
        productsLoad = [];
        console.log($element);
        $element.masonry({
          itemSelector: '.masonry-brick',
          isAnimated: true
        });
        return $scope.loadMore = function() {
          var i, last;
          last = productsLoad.length - 1;
          i = 1;
          while (i <= 15 && (i + last) < productsRest.length) {
            productsLoad.push(productsRest[last + i]);
            i++;
          }
          return $scope.productsLoad = productsLoad;
        };
      }), true);
    }
  };
});

alt.directive('preload', function() {
  return {
    restrict: 'AE',
    transclude: true,
    replace: true,
    templateUrl: '/views/directives/preload.html',
    link: function(scope, element, attrs, ctrl, transclude) {
      return transclude(scope.$parent, function(clone, scope) {
        return element.append(clone);
      });
    }
  };
});

alt.directive('scrollTrigger', function($window) {
  return {
    link: function(scope, element, attrs) {
      var doc, e, offset;
      offset = parseInt(attrs.threshold);
      e = jQuery(element[0]);
      doc = jQuery(document);
      return angular.element(document).bind('scroll', function() {
        if (doc.scrollTop() > $(document).height() - $window.innerHeight - offset) {
          return scope.$apply(attrs.scrollTrigger);
        }
      });
    }
  };
});

alt.directive('searchResults', function($route, $location, $rootScope, products, toaster) {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/search-results.html',
    controller: function($scope) {
      $scope.dataURL = $rootScope.dataURL;
      return $scope.lastBought = function(productID) {
        return products.lastBought(productID);
      };
    }
  };
});

alt.directive('videoPlayer', function($rootScope) {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/video-player.html',
    scope: 'true',
    controller: function($scope, $sce, brand, $rootScope, $routeParams) {
      $scope.brand = $routeParams.brand;
      return brand.getBrand($scope.brand).child('videoFile').on('value', function(video) {
        $scope.brandVideo = video.val();
        return brand.getBrand($scope.brand).child('videoPoster').on('value', function(poster) {
          $scope.brandVideoPoster = poster.val();
          return $scope.config = {
            autoHide: true,
            preload: 'none',
            sources: [
              {
                src: $sce.trustAsResourceUrl($rootScope.dataURL + '/assets/brands/' + $scope.brandVideo),
                type: 'video/mp4'
              }
            ],
            theme: {
              url: '/assets/css/videogular.css'
            },
            plugins: {
              poster: $rootScope.dataURL + '/assets/brands/' + $scope.brandVideoPoster
            }
          };
        });
      });
    }
  };
});

alt.directive('wrapBigProducts', function($location, $rootScope, products, toaster, $window) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/wrap-big-products.html',
    scope: {
      products: '='
    },
    controller: function($scope) {
      $window.scrollTo(0, 0);
      return $scope.$watch('products', (function(newVal, oldVal) {
        var productsLoad, productsRest;
        $scope.productsInit = _.slice($scope.products, 0, 9);
        productsRest = _.slice($scope.products, 9);
        productsLoad = [];
        return $scope.loadMore = function() {
          var i, last;
          last = productsLoad.length - 1;
          i = 1;
          while (i <= 9 && (i + last) < productsRest.length) {
            productsLoad.push(productsRest[last + i]);
            i++;
          }
          return $scope.productsLoad = productsLoad;
        };
      }), true);
    }
  };
});

alt.directive('wrapProducts', function($location, $rootScope, products, toaster, $window) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/wrap-products.html',
    scope: {
      products: '='
    },
    controller: function($scope) {
      $window.scrollTo(0, 0);
      return $scope.$watch('products', (function(newVal, oldVal) {
        var productsLoad, productsRest;
        $scope.productsInit = _.slice($scope.products, 0, 12);
        productsRest = _.slice($scope.products, 12);
        productsLoad = [];
        return $scope.loadMore = function() {
          var i, last;
          last = productsLoad.length - 1;
          i = 1;
          while (i <= 12 && (i + last) < productsRest.length) {
            productsLoad.push(productsRest[last + i]);
            i++;
          }
          return $scope.productsLoad = productsLoad;
        };
      }), true);
    }
  };
});
