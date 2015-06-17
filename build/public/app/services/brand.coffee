alt.factory 'brand', ($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) ->
  brandsRef = new Firebase FIREBASE_URL + '/brands'
  productsRef = new Firebase FIREBASE_URL + '/products'
  inspirationsRef = new Firebase FIREBASE_URL + '/inspirations'
  tracesRef = new Firebase FIREBASE_URL + '/traces'
  usersRef = new Firebase FIREBASE_URL + '/users'
  statsRef = new Firebase FIREBASE_URL + '/stats'
  flagsRef = new Firebase FIREBASE_URL + '/flags'
  
  output =
    getBrand: (brand) ->
      return brandsRef.child(brand)

    getBrandProducts: (brand) ->
      return $firebaseArray productsRef.orderByChild('brand').equalTo(brand)

    getBrandInspirations: (brand) ->
      return $firebaseArray inspirationsRef.orderByChild('brand').equalTo(brand)

    getBrandTraces: (brand) ->
      return $firebaseArray tracesRef.orderByChild('brand').equalTo(brand)

    followBrand: (brand) ->
      brandFollowedRef = flagsRef.child('follows').child(brand)
      followedCountRef = statsRef.child('followsCount').child(brand)
      followedCountArray = $firebaseArray brandFollowedRef
      
      followInfo = 
        date: Firebase.ServerValue.TIMESTAMP

      brandFollowedRef.child($rootScope.currentUser.$id).set followInfo, ->
        console.log 'Follow added to brand'
        followedCountRef.set followedCountArray.length, ->
          console.log 'Follows counted'

      userFollowsRef = usersRef.child($rootScope.currentUser.$id).child('follows')
      userFollowsRef.child(brand).set followInfo, ->
        console.log 'Follow added to user'

    unfollowBrand: (brand) ->
      brandFollowedRef = flagsRef.child('follows').child(brand)
      followedCountRef = statsRef.child('followsCount').child(brand)
      followedCountArray = $firebaseArray brandFollowedRef

      brandFollowedRef.child($rootScope.currentUser.$id).remove ->
        console.log 'Follow removed from brand'
        followedCountRef.set followedCountArray.length, ->
          console.log 'Follows counted'

      followsRefUser = usersRef.child($rootScope.currentUser.$id).child('follows').child(brand)
      followsRefUser.remove ->
        console.log 'Follow removed from user'

    followedBrands: (userID) ->
      followedBrands = []
      followedBrandsRef = usersRef.child(userID).child('follows')
      followedBrandsArray = $firebaseArray followedBrandsRef

      promise = followedBrandsArray.$loaded (data) ->
        _.forEach data, (snapshot) ->
          followedBrandObj = $firebaseObject brandsRef.child(snapshot.$id)
          followedBrands.push followedBrandObj
        return followedBrands
      return promise

    currentUserFollowedBrands: ->
      currentUserFollowedBrandsRef = usersRef.child($rootScope.currentUser.$id).child('follows')
      return $firebaseArray currentUserFollowedBrandsRef

  return output