(function() {
	'use strict';
	angular
        .module('app')
        .controller('dashboardController', Controller);
    Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage','userService','$window'];
    function Controller($scope, $rootScope, $state, $stateParams, $localStorage,userService,$window) {
       	if ($state.current.name == 'home'){
          // console.log("hiiiiii");
          // if(($localStorage.userData) && $rootScope.User==null ){
          //   $state.go("login");
          // }
           console.log($rootScope.userLogin,$rootScope.User)
           $scope.selectdepart=function(item){
            $rootScope.selected=item;
            $state.go('timetable');
           }
          userService.getdept().then(function(res) { 
            $scope.deptdata=res.data;
             console.log($scope.deptdata);
          }).catch(function(err){
              console.log(err);
          }); 
          
          $scope.good=function(){
            userService.test($rootScope.User).then(function(res) { 
              $scope.test=res.data;
            }).catch(function(err){
                console.log(err);
            }); 
          }
          if($rootScope.User){
            userService.GetTaskTypeList($rootScope.User).then(function(res) { 
              var arr1=[];
              $scope.tasktypelist=res.data;
              $scope.tasktypelist.forEach(element => {
                arr1.push(element.statename);
              });
              $rootScope.User.rolls=arr1;
            }).catch(function(err){
                console.log(err);
            }); 
          }
          
      }
    }
})();