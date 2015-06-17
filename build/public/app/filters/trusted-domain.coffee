alt.filter 'trustedDomain', ($sce) ->
  (url) ->
    $sce.trustAsResourceUrl url