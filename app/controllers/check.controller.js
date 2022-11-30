(function() {
    'use strict';

    angular
        .module('app')
        .controller('checkstatus', Controller)
        ;

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage', '$window'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {

             if($state.current.name == "checkstatus"){
                if($localStorage.week && !$localStorage.userData){
                    // $state.go("customsearch");
                    $state.go("home");

                }else{
                    $state.go("home");
                }
                

}
}
})();