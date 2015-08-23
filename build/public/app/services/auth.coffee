alt.factory 'auth', ($rootScope, FIREBASE_URL, $firebaseAuth, $firebaseObject, $location, toaster) ->
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
        console.log authData.password
        if authData.uid
          usersRef = new Firebase FIREBASE_URL + '/users'
          usersRef.child(authData.uid).child('password').set userObj.password
          if authData.password.isTemporaryPassword
            $location.path '/user/' + authData.uid + '/profile'
            toaster.pop 'success', 'You can reset your password here'
          else
            $location.path '/'
            toaster.pop 'success', 'Successfully login'
            $route.reload()
        else
          switch error.code
            when 'INVALID_USER' then toaster.pop 'warning', 'Invalid user email'
            when 'INVALID_PASSWORD' then toaster.pop 'warning', 'Invalid password'
            else toaster.pop 'warning', error

    logout: ->
      authRef.$unauth()

    register: (userObj) ->
      authRef.$createUser userObj

    resetPassword: (userEmail) ->
      authRef.$resetPassword {email: userEmail}

    changePassword: (email, oldPassword, newPassword) ->
      authRef.$changePassword(
        email: email
        oldPassword: oldPassword
        newPassword: newPassword
      ).then(->
        console.log 'Password changed successfully!'
      ).catch (error) ->
        console.error 'Error: ', error

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