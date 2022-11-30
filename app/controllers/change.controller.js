// const e = require("express");

(function() {
    'use strict';
    angular
        .module('app')
        .controller('changepass', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        if ($rootScope.userLogin && $rootScope.User) {
            if($state.current.name ==  "Change Password"){
                $scope.changepass=function(userdata){
                    if(userdata.newpassword==userdata.neWpassword){
                        var details={
                            userid:$rootScope.User.userId,
                            newpass:userdata.newpassword,
                            oldpass:userdata.name
                        }
                        userService.Changepassword(details).then(function(res){
                            if(res.data.check){
                                alert("Password Sucessfully changed");
                                $state.go("logout");
                            }else{
                                alert("current password is wrong");
                            }
                        }).catch(function(err){
                            console.log(err);
                        })
                    }else{
                        alert("Password Mismatching");
                    }
                }
            }
        }else{
            $state.go("login");
        }
    }
})();