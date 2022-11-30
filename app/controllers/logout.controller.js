(function() {
    'use strict';

    angular
        .module('app')
        .controller('logoutController', Controller);

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage'];
    //console.log("entry::::::");
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage) {
        if($localStorage.userData){
            userService.Logout($localStorage.userData).then(function(res) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                    if(res.success){
                        $localStorage.userData = null;
                        $rootScope.userLogin = false;
                        $rootScope.isAdmin = false;
                        $rootScope.name = '';
                        $rootScope.User=null;
                        $(".success").removeClass("in").show();
                        $(".success").delay(200).addClass("in").fadeOut(3000);
                        $rootScope.message = 'Logout';
                        $state.go("home");
                    }
                    else{
                        
                    }
            }).catch(function(err) {
                console.log(err);
            });
            
        }
             
    }
})();