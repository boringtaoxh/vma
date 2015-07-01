alt.factory 'auth', ($rootScope, FIREBASE_URL, $firebaseAuth, $firebaseObject) ->
  rootRef = new Firebase FIREBASE_URL
  authRef = $firebaseAuth rootRef

  authRef.$onAuth (authUser) ->
    if authUser
      userRef = new Firebase FIREBASE_URL + '/users/' + authUser.uid
      userObj = $firebaseObject userRef
      $rootScope.currentUser = userObj
    else
      $rootScope.currentUser = ''

  output =
    login: (userObj) ->
      authRef.$authWithPassword( userObj
      ).then (authData) ->
        if authData.uid
          usersRef = new Firebase FIREBASE_URL + '/users'
          usersRef.child(authData.uid).child('password').set userObj.password

    logout: ->
      authRef.$unauth()

    register: (userObj) ->
      authRef.$createUser userObj

    resetPassword: (userEmail) ->
      authRef.$resetPassword {email: userEmail}

    storeUserInfo: (userObj, regUser) ->
      usersRef = new Firebase FIREBASE_URL + '/users'

      if userObj.newsletter == undefined then userObj.newsletter = false

      userInfo = 
        uid: regUser.uid
        firstname: userObj.firstname
        lastname: userObj.lastname
        username: ''
        email: userObj.email
        password: userObj.password
        fashion: userObj.fashion
        newsletter: userObj.newsletter
        address: ''
        colour: ''
        category: ''
        brand: ''
        loves: ''
        follows: ''
        reserves: ''
        date: Firebase.ServerValue.TIMESTAMP

      usersRef.child(regUser.uid).set userInfo, ->
        console.log userInfo
      return

    requireAuth: ->
      authRef.$requireAuth()

    getCurrentUser: (uid) ->
      userRef = new Firebase FIREBASE_URL + '/users/' + uid
      return $firebaseObject userRef

  return output