(function() {
    'use strict';

    angular
        .module('app')
        .controller('fagController', Controller);

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
    if($state.current.name ==  "viewitem"){
       userService.viewitem($rootScope.selected).then(function(res) { 
            console.log($rootScope.selected);
            console.log(res.data);
            $scope.items=res.data;
          
           
      }).catch(function(err){
          console.log(err);
        //  errorMessage(err);
     }); 
     $scope.addcart=function(item){
        // console.log(item);
        alert("Item added to cart");
     }
}
}
})();