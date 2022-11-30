(function() {
    'use strict';
    angular
        .module('app')
        .controller('Additems', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        // if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name == "Add items"){

            }
            // }else{
            //     $state.go("login");
            // }
        }
    })();