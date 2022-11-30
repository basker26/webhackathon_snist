// const e = require("express");

(function() {
    'use strict';
    angular
        .module('app')
        .controller('addfacc', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name ==  "Add faculty"){
                function refresh() {
                    // body...
                    userService.getfac().then(function(res){
                    $scope.facdata=res.data;
                  }).catch(function(err){
                    console.log(err);
                  })    
                }
                $scope.addfaculty=function(item,facdata){
                    var ob=facdata.find(o=>o.name===item.name);
                    if(ob){
                        alert("faculty already exists");
                    }else{
                        userService.addfaculty(item).then(function(res){
                        item.dept=null;
                        item.abbr=null;
                        item.name=null;
                    }).catch(function(err){
                        console.log(err);
                    });
                    // userService.getfac().then(function(res){
                    //     $scope.facdata=res.data;
                    //   }).catch(function(err){
                    //     console.log(err);
                    //   })
                    refresh();    
                    }
                    
                }
                $scope.change=function(item){
                    var details=item;
                    userService.active(details).then(function(res){

                    }).catch(function(err){
                        console.log(err);
                    });
                    userService.getfac().then(function(res){
                        $scope.facdata=res.data;
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                $scope.delete=function(item){
                    var details=item;
                    userService.deletefac(details).then(function(res){

                    }).catch(function(err){
                        console.log(err);
                    })
                }
                $scope.check=function(item){
                    if(item.active!=0){
                        item.Status="Active";
                    }else{
                        item.Status="Inactive";
                    }
                }
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
            // else if($state.current.name){
            //     console.log("vjkhdjkdhf")
            // }
        }else{
            $state.go("login");
        }
    }
})();