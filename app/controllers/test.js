


(function() {
    'use strict';

    angular
        .module('app')
        .controller('setprefered', Controller);

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage ) {
        
        if ($rootScope.userLogin) {
        

    if($state.current.name ==  "setprefered"){
        $scope.d={};
        $scope.d.faculty=[];
        $scope.$watch('selected', function(nowSelectedvalue){
            $scope.d.faculty = [];
            
            if( ! nowSelectedvalue ){
                // if not selected then return
                return;
            }
            angular.forEach(nowSelectedvalue, function(vals){
                $scope.d.faculty.push( vals );
            });
        });
       
        $scope.confirmfacallotment=function(item,tem2){
            item.forEach(element=>{
               var  details={
                    subinfo:element,
                    deptdetails:tem2
                }
                userService.facallotment(details).then(function(res){

                }).then(function(err){
                    console.log(err);
                })
            })
        }
        $scope.subjectinfo;
        $scope.facsub=[];
        $scope.add=function(d){
            $scope.facsub.push(d);
            console.log($scope.facsub);
            $scope.d=null;
        }
        $scope.savedata=function(item,count){
            if(item.lab){
                var frm=item.lfrm;
                for (let index = frm; index < item.lto; index++) {
                    console.log(item.lfrm+1,index);
                   $scope.subjectinfo.days[count].periods[index]=0;
                   console.log($scope.subjectinfo.days[count].periods[index],index);
                }
                console.log($scope.subjectinfo.days[count].periods)
            }  
            if(item.theory){
                console.log(item,"theory",index);
            }          
        }
        $scope.set=function(set){
            console.log(set);
        }
        $scope.fetch=function(day,frm,to,dep){
            var details={
                day:day,
                frm:frm,
                to:to,
                dept:dep
            }
            // console.log(details)
            userService.facavb(details).then(function(res){
                $scope.facavb=res.data;
                console.log(res.data);
            }).catch(function(err){
                console.log(err);
            });
        }
        $scope.batch=[{value:"I",active:1},{value:"II",active:1},{value:"III",active:1}];
        $scope.period2=[{vale:1},{value:2},{value:3},{value:4}];
        $scope.period3=[{value:2},{value:3},{value:4}];
        $scope.period4=[{value:3},{value:4}];
        $scope.period5=[{value:6},{value:7},{value:8}];
        $scope.period6=[{value:7},{value:8}];
        $scope.period7=[{value:8}];
        

        $scope.finalinfo=[];
        userService.custom().then(function(res) { 
            $scope.filterdata=res.data;
            console.log($scope.filterdata);
        }).catch(function(err){
        console.log(err);
        }); 
        $scope.getweekrpt=function(item){
            userService.subinfo(item).then(function(res){
                $scope.subjectinfo=res.data;
                $scope.myDropdownModel = [$scope.subjectinfo.facinfo[0]];
              
                // console.log($scope.subjectinfo.Lab);
                $scope.subjectinfo.days.forEach(element => {
                    element.periods=[1,1,1,1,1,1,1];
                });
                console.log($scope.subjectinfo);
                            // console.log($scope.info);

            }).catch(function(err){
                console.log(err);
            });
            

        }

}











}
}
})();