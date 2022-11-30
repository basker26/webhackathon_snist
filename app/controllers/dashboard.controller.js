(function() {
	'use strict';
	angular
        .module('app')
        .controller('dashboardController', Controller);
    Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage','userService','$window'];
    function Controller($scope, $rootScope, $state, $stateParams, $localStorage,userService,$window) {
       	if ($state.current.name == 'home'){
           console.log($rootScope.userLogin,$rootScope.User)
           $scope.selectdepart=function(item){
            $rootScope.selected={name:item.building_name};

            $state.go('viewitem');
           }
          userService.bycategory().then(function(res) { 
            console.log(res.data)
            $scope.data=res.data;
          }).catch(function(err){
              console.log(err);
          }); 
          
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