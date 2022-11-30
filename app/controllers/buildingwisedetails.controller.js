(function() {
    'use strict';
    angular
        .module('app')
        .controller('build', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name ==  "Dept details"){
                userService.custom().then(function(res) { 
                        $scope.data=res.data;
                }).catch(function(err){
                console.log(err);
                //  errorMessage(err);
                }); 
                $scope.getdetails=function(item){
                    var details={
                        id:item
                    }
                    userService.getdeptrooms(details).then(function(res){
                        // if(!res.success){
                        //     $state.go("checkstatus")
                        // }
                        $scope.rooms=res.data;
                        console.log(res);
                    }).catch(function(err){
                        console.log(err);
                    });
                }
            }
        }else{
            $state.go("login");
        }
    }
})();