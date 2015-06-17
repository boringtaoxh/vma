alt.factory 'products', ($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject, auth) ->
  productsRef = new Firebase FIREBASE_URL + '/products'
  productsArray = $firebaseArray productsRef
  usersRef = new Firebase FIREBASE_URL + '/users'
  statsRef = new Firebase FIREBASE_URL + '/stats'
  flagsRef = new Firebase FIREBASE_URL + '/flags'

  output =
    getProducts: () ->
      promise = productsArray.$loaded (data) ->
        return data
      return promise

    getRandomProducts: () ->
      promise = productsArray.$loaded (data) ->
        return _.shuffle data
      return promise

    getPreferProducts: () ->
      promise = productsArray.$loaded (productsData) ->
        auth.getCurrentUser($rootScope.currentUser.$id).$loaded().then (userData) ->
          products = _.where productsData, { 'gender': [userData.fashion] }
          return _.shuffle products
      return promise

    getExploreProducts: (gender, category) ->
      promise = productsArray.$loaded (data) ->
        if gender == 'x' || gender == 'y'
          products = _.where data, { 'gender': [gender] }
        else 
          products = data
        if category != 'All'
          products = _.where products, { 'category': category }

        _.forEach products, (value, key) ->
          _.extend products[key], {lovesCount: 0}
          statsRef.child('lovesCount').child(value.$id).on 'value', (data) ->
            if data.val() != null && data.val() != 0
              products[key].lovesCount = data.val()
          _.extend products[key], {lastBought: 0}
          flagsRef.child('bought').child(value.$id).on 'value', (data) ->
            if data.val() != null && data.val() != 0
              products[key].lastBought = data.val()
        return products
      return promise

    getRelateProducts: (look) ->
      promise = productsArray.$loaded (data) ->
        products = _.where data, { 'relate': look }
        return products
      return promise

    getProduct: (productID) ->
      return productsRef.child(productID)

    addProduct: (product) ->
      productInfo = 
        name: product.name 
        date: Firebase.ServerValue.TIMESTAMP

      productsRef.push productInfo, ->
        console.log 'Product added'

    deleteProduct: (productID) ->
      productRef = productsRef.child(productID)
      productRef.child('loves').on 'value', (users) ->
        if users.val() != null
          users.forEach (user) ->
            usersRef.child(user.key()).child('loves').child(productID).remove ->
              console.log 'Love removed from user'
            productRef.remove ->
              console.log 'Product deleted'
        else
          productRef.remove ->
            console.log 'Product deleted'

    flagProduct: (flagType, productID) ->
      productFlagRef = flagsRef.child(flagType + 's').child(productID)
      flagCountArray = $firebaseArray productFlagRef
      flagCountStatsRef = statsRef.child(flagType + 'sCount').child(productID)

      flagInfo = 
        date: Firebase.ServerValue.TIMESTAMP

      productFlagRef.child($rootScope.currentUser.$id).set flagInfo, ->
        console.log productID + ' ' + flagType + ' added to Flags'
        flagCountStatsRef.set flagCountArray.length, ->
          console.log flagType + ' counted in Stats'

      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's')
      userFlagRef.child(productID).set flagInfo, ->
        console.log flagType + ' added to user'

    disflagProduct: (flagType, productID) ->
      productFlagRef = flagsRef.child(flagType + 's').child(productID)
      flagCountArray = $firebaseArray productFlagRef
      flagCountStatsRef = statsRef.child(flagType + 'sCount').child(productID)

      productFlagRef.child($rootScope.currentUser.$id).remove ->
        console.log flagType + ' removed from Flags'
        if flagCountArray.length > 0 
          flagCountStatsRef.set flagCountArray.length, ->
            console.log flagType + ' counted in Stats'
        else
          flagCountStatsRef.remove ->
            console.log flagType + ' removed in Stats'

      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's').child(productID)
      userFlagRef.remove ->
        console.log flagType + ' removed from user'

    getFlagCount: (flagType) ->
      return $firebaseArray statsRef.child(flagType + 'sCount')

    getUserFlaggedProducts: (flagSection, userID) ->
      flaggedProducts = []
      flaggedProductsRef = usersRef.child(userID).child(flagSection)
      flaggedProductsArray = $firebaseArray flaggedProductsRef
      promise = flaggedProductsArray.$loaded (data) ->
        _.forEach data, (snapshot) ->
          flaggedProductObj = $firebaseObject productsRef.child(snapshot.$id)
          flaggedProducts.push flaggedProductObj
        return flaggedProducts
      return promise

    getCurrentUserFlaggedProducts: (flagType) ->
      currentUserFlaggedProductsRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's')
      return $firebaseArray currentUserFlaggedProductsRef

    lastBought: (productID) ->
      productFlagRef = flagsRef.child('bought').child(productID)

      flagInfo = Firebase.ServerValue.TIMESTAMP

      productFlagRef.set flagInfo, ->
        console.log productID + ' bought added to Flags'
      
  return output