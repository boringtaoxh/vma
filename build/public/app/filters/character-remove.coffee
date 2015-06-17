alt.filter 'charactersRemove', ->
  (value) ->
    if !value
      return ''
    else
    	return value.replace(/[^\w]/g, '')