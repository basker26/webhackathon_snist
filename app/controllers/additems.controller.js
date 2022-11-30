(function() {
    'use strict';
    angular
        .module('app')
        .controller('Additems', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        // if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name == "Add items"){
                userService.getdept().then(function(res) { 
                    $scope.deptdata=res.data;
                     console.log($scope.deptdata);
                  }).catch(function(err){
                      console.log(err);
                  }); 
                  $scope.additems=function(item){
                    userService.additem(item).then(function(res){
                        alert("Added Item Sucessfully");
                        $state.go("home");
                    }).catch(function(err){
                        console.log(err);
                    })
                  }

            }
            // }else{
            //     $state.go("login");
            // }
        }
    })();