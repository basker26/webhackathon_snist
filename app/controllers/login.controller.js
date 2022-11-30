

 (function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', Controller);

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage) {
        

        $rootScope.userLogin = false;
        


        if ($state.current.name == 'login') {
            if($localStorage.userData && !$rootScope.User){
                $scope.user={
                    userName:$localStorage.userData.userName,
                    password:$localStorage.userData.password
                };
                userService.Login($scope.user).then(function(res) {
                    //console.log($scope.user);
                    if (res.success) {


                        //alert("login controller");
                        $(".success").removeClass("in").show();
                        $(".success").delay(200).addClass("in").fadeOut(3000);
                        
                        $rootScope.User=res.data;
                        $rootScope.userLogin=true;
                        $localStorage.userData = res.data;
                        $localStorage.userData.password=$scope.user.password;
                        $localStorage.userData.userName=$scope.user.userName;
                        if($rootScope.User.rolename=='Faculty'){
                            $state.go("home");
                        }else{
                            $state.go("home");

                        }
                    } else {
                        $(".error").removeClass("in").show();

                        // setTimeout(function(){ alert("Hello"); }, 3000);

                        $(".error").delay(200).addClass("in").fadeOut(3000);
                        alert("Incorrect Username/Password/No user found");
                        $localStorage.userData = null;
                        
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
            $scope.login = function() {
                // userService is to get the user data
                userService.Login($scope.user).then(function(res) {
                    //console.log($scope.user);
                    if (res.success) {


                        //alert("login controller");
                        $(".success").removeClass("in").show();
                        $(".success").delay(200).addClass("in").fadeOut(3000);
                        
                        $rootScope.User=res.data;
                        $rootScope.userLogin=true;
                        $localStorage.userData = res.data;
                        $localStorage.userData.password=$scope.user.password;
                        $localStorage.userData.userName=$scope.user.userName;
                        if($rootScope.User.rolename=='Faculty'){
                            $state.go("home");
                        }else{
                            $state.go("home");

                        }
                    } else {
                        $(".error").removeClass("in").show();

                        setTimeout(function(){ alert("Hello"); }, 3000);

                        $(".error").delay(200).addClass("in").fadeOut(3000);
                        alert("Incorrect Username/Password/No user found");
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }
    }
})();