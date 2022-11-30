(function() {
    'use strict';
    angular
        .module('app')
        .controller('addsub', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window'];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name ==  "Add subjects"){
                $scope.addsub=false;
                $scope.visible=true;
                $scope.sublist=[];
                $scope.addsubjects=function(item){
                    $scope.visible=false;
                    $scope.addsub=true;
                }
                $scope.addsubject=function(item){
                        var details=item;                    
                        $scope.sublist.push(details);
                        $scope.sub=null;
                }
                $scope.confirm=function(item,dept){
                    if(item.length>0){
                        var details={
                            data:item,
                            id:dept
                        }
                        userService.addsubject(details).then(function(res){
                            $state.go("home");
                        }).catch(function(err){
                            console.log(err)
                        })
                    }else{
                        alert("please insert data");
                    }
                }
                $scope.deletesub=function(item){
                    $scope.sublist.splice(item,1);
                }
                userService.custom().then(function(res){
                    $scope.data=res.data;
                }).catch(function(err){
                    console.log(err)
                });
            }
        }else{
            $state.go("login");
        }
    }
})();