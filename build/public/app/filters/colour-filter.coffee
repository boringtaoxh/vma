alt.filter 'colourFilter', ($location) ->
  (products, scope) ->
    if scope.colourIncludes.length > 0 && products
      products = products.filter (product) ->
        _.intersection(product.color, scope.colourIncludes).length > 0
    else
      products