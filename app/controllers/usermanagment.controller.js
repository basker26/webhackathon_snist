(function() {
    'use strict';
    angular
        .module('app')
        .controller('usermanag', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        // if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name == "User Managemnt"){
                $scope.adduser=function(item,data){
                    var ob=data.find(o=>o.name===item.name);
                    if(ob){
                        alert("user already Exits");
                    }else{
                            userService.adduser(item).then(function(res){
                        if(res.data.check==true){
                            alert("User is created Sucessfully");
                            userService.getusers().then(function(res){
                                $scope.data=res.data;
                            }).catch(function(err){
                                console.log(err);
                            })
                        }else if(res.data.check==false){
                            alert("User already Exits");
                        }
                    }).catch(function(err){
                        console.log(err);
                    })    
                    }

                    
                }
                $scope.change=function(item){
                    userService.deactivateuser(item).then(function(res){
                        userService.getusers().then(function(res){
                            $scope.data=res.data;
                        }).catch(function(err){
                            console.log(err);
                        })  
                    }).catch(function(err){ 
                        console.log(err);
                    })
                }
                $scope.delete=function(item){
                    userService.deleteuser(item).then(function(res){
                        userService.getusers().then(function(res){
                            $scope.data=res.data;
                        }).catch(function(err){
                            console.log(err);
                        })  
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                $scope.check=function(item){
                    if(item.valid!=0){
                        item.Status="Active";
                    }else{
                        item.Status="Inactive";
                    }
                }
                userService.getusers().then(function(res){
                    $scope.data=res.data;
                }).catch(function(err){
                    console.log(err);
                })
            }
        // }else{
        //     $state.go("login");
        // }
    }
})();