alt.factory 'user', ($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject, $routeParams) ->
  usersRef = new Firebase FIREBASE_URL + '/users'
  product = (userID) ->
    return $firebaseObject productsRef.child(userID)

  output =
    getUser: (user) ->
      userObject = $firebaseObject usersRef.child(user)
      promise = userObject.$loaded (data) ->
        return data
      return promise

    getUserColour: (user) ->
      colourArray = $firebaseArray usersRef.child(user).child('colour')
      promise = colourArray.$loaded (data) ->
        return data
      return promise

    getUserCategory: (user) ->
      categoryArray = $firebaseArray usersRef.child(user).child('category')
      promise = categoryArray.$loaded (data) ->
        return data
      return promise

    getUserBrand: (user) ->
      brandArray = $firebaseArray usersRef.child(user).child('brand')
      promise = brandArray.$loaded (data) ->
        return data
      return promise

    getUserFashion: (user) ->
      return usersRef.child(user).child('fashion')

    getUserNewsletter: (user) ->
      return usersRef.child(user).child('newsletter')

    updateUserInfo: (user) ->
      if user != undefined
        userID = $routeParams.userID
        editedUser = $firebaseObject usersRef.child(userID)
        editedUser.$loaded (data) ->
          if user.firstname == '' then firstname = data.firstname else firstname = user.firstname
          if user.lastname == '' then lastname = data.lastname else lastname = user.lastname
          if user.username == '' then username = data.username else username = user.username
          if user.address == '' then address = data.address else address = user.address
          if user.fashion == '' then fashion = data.fashion else fashion = user.fashion
          if user.colour == '' then colour = data.colour else colour = user.colour
          if user.category == '' then category = data.category else category = user.category
          if user.brand == '' then brand = data.brand else brand = user.brand
          if user.newsletter == '' then newsletter = data.newsletter else newsletter = user.newsletter
          if data.loves == undefined then loves = '' else loves = data.loves
          if data.follows == undefined then follows = '' else follows = data.follows
          if data.reserves == undefined then reserves = '' else reserves = data.reserves

          userInfo =
            uid: data.uid
            date: data.date
            firstname: firstname
            lastname: lastname
            username: username
            email: data.email
            address: address
            fashion: fashion
            colour: colour
            category: category
            brand: brand
            newsletter: newsletter
            loves: loves
            follows: follows
            reserves: reserves

          usersRef.child(user.$id).set userInfo, ->
      return
      
  return output