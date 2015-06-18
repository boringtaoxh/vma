alt.factory 'info', ($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) -> 
  infoRef = new Firebase FIREBASE_URL + '/info'
  
  output =
  	getInfo: ->
      $firebaseArray infoRef.orderByChild('order')

    getInfoSection: (section) ->
      infoRef.child(section)

 	return output