(function() {
    'use strict';
    angular
        .module('app')
        .controller('prefered', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window',];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window,) {
        // if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name =="setprefered"){
                console.log("hajsdjsad");
                $scope.addprefered=function(item){
                    var details={
                        id:item.sem
                    }
                    $localStorage.week=details;
                    alert("your prefered item set");
                    $state.go("customsearch")
                }
                userService.custom().then(function(res) { 
                    $scope.data=res.data;
                    // console.log($scope.filterdata)
                }).catch(function(err){
                console.log(err);
                }); 
            
            }
            }
        // }
    })();