(function() {
    'use strict';
    angular
        .module('app')
        .controller('faculty', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name == "faculty"){
                $scope.viewfaculty=function(item){
                    var data={
                        id:item,
                    }
                    userService.viewfac(data).then(function(res){
                        $scope.details=res.data;
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                var data={id:$rootScope.User.userId};
                userService.viewfac(data).then(function(res){
                    $scope.details=res.data;
                    console.log(res.data);
                }).catch(function(err){
                    console.log(err);
                })
                userService.custom().then(function(res){
                    $scope.data=res.data.data;
                }).catch(function(err){
                    console.log(err)
                });
                userService.getfac().then(function(res){
                    $scope.facdata=res.data;
                  }).catch(function(err){
                    console.log(err);
                  })
            }
        }else{
            $state.go("login");
        }
    }
})();