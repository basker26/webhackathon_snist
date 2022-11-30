
(function() {
    'use strict';
    angular
        .module('app')
        .controller('deletedata', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window',];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window,) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name ==  "Clear Timetable"){
                $scope.deleteshedule=function(item){
                    var details={
                        id:item.id
                    }
                    userService.deleteshedule(details).then(function(res){
                        if(res){
                            userService.getarchives().then(function(res){
                                $scope.list=res.data;
                                console.log($scope.list);
                            }).catch(function(err){
                                console.log(err)
                            }) 
                        }
                    }).catch(function(err){
                        console.log(err)
                    })
                }
                $scope.deletearchive=function(item){
                    var details={
                        id:item.id
                    }
                    userService.deletearchive(details).then(function(res){
                        if(res){
                            userService.getarchives().then(function(res){
                                $scope.list=res.data;
                                console.log($scope.list);
                            }).catch(function(err){
                                console.log(err)
                            }) 
                        }
                    }).catch(function(err){
                        console.log(err)
                    })
                }
                
                userService.getarchives().then(function(res){
                    $scope.list=res.data;
                    console.log($scope.list);
                }).catch(function(err){
                    console.log(err)
                })
            }
        }else{
            $state.go("login");
        }
    }
})();