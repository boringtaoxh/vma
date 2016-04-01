describe('',function(){
  var scope = {};

  beforeEach(function(){
    module('alt');
    inject(function($controller){
      $controller('productsCtrl',{$scope:scope});
    });
  });
  it('',function(){
      
  });
});
