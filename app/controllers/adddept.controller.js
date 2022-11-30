
(function() {
    'use strict';
    angular
        .module('app')
        .controller('addDept', Controller);
    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage','$window',];
    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window,) {
        if ($rootScope.userLogin && $rootScope.User && $rootScope.User.rolls.includes($state.current.name)) {
            if($state.current.name ==  "Add Department"){
                $scope.deactivate=null;
                userService.custom().then(function(res) { 
                    $scope.filterdata=res.data;
                }).catch(function(err){
                console.log(err);
                }); 
                $scope.deleteroom=function(item){
                    // console.log(item);
                    var detail={
                        id:item
                    }
                    userService.deleteroom(detail).then(function(res){
                        if(res){
                            userService.getrooms().then(function(res){
                                $scope.listrooms=res.data;
                                console.log($scope.listrooms);
                            }).catch(function(err){
                                console.log(err);
                            })
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                userService.getrooms().then(function(res){
                    $scope.listrooms=res.data;
                    console.log($scope.listrooms);
                }).catch(function(err){
                    console.log(err);
                });
                userService.deactivate().then(function(res){
                    if(res.data){
                        // $scope.deactivate=res.data[0].core_task;
                        // res.data[0].core_task==1?c="Active":$scope.deactivate="Deactive";
                        if(res.data[0].core_task==1){
                            $scope.deactivate="Active";
                        }else{
                            $scope.deactivate="Deactive";
                        }
                    }
                }).catch(function(err){
                    console.log(err);
                })
                $scope.example8data = [ {id: 1, label:1}, {id: 2, label:2}, {id: 3, label:3},{id:4,label:4},{id:5,label:5},{id:6,label:6},{id:7,label:7},{id:8,label:8} ];
                $scope.example10data = [{label:"BE"},{label:"ME"}];
                $scope.example8model = [];
                $scope.example9model = [];
                $scope.example10model = [];
                $scope.example11model = [];
                $scope.example8settings = { checkBoxes: true, };
                $scope.activate=function(item){
                    var data={
                        data:item,
                    };
                    userService.activaterole(data).then(function(res){
                        if(res){
                            if($scope.deactivate=="Active"){
                                $scope.deactivate= "Deactive";
                            }else if($scope.deactivate=="Deactive"){
                                $scope.deactivate= "Active";

                            }
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                }

                $scope.deletesemester= function(spec){
                    var details=spec;
                    userService.deletespec(details).then(function(res){
                        if(res)
                        {
                            userService.custom().then(function(res) { 
                                $scope.filterdata=res.data;
                            }).catch(function(err){
                            console.log(err);
                            }); 
                        }
                    }).then(function(err){
                        console.log(err);
                    })
                }
                
                $scope.addrooms=function(item){
                    var details=item;
                    userService.addrooms(details).then(function(res){
                        if(res){
                            userService.getrooms().then(function(res){
                                $scope.listrooms=res.data;
                                console.log($scope.listrooms);
                            }).catch(function(err){
                                console.log(err);
                            });
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                    console.log(item);
                }
                $scope.addDepartment=function(details){
                    if(($scope.example9model.length>0 || $scope.example11model.length>0) && $scope.example10model.length>0 ){
                        var course=[];
                        $scope.example10model.forEach(element => {
                            course.push(element.label);  
                            console.log(element.label)
                        });
                        console.log(course)
                        if(course.length==2 && $scope.example9model.length>0 && $scope.example11model.length>0){
                            var data={
                                deptname:details.name,
                                deptcourse:$scope.example10model,
                                deptSpecialization:details.Specialization,
                                deptsemesterfor:[$scope.example9model,$scope.example11model],
                                // deptsemesterforME:$scope.example11model,
                            }
                            console.log($scope.example9model.length,$scope.example11model.length)
                            userService.addDepartment(data).then(function(res){
                                if(!res.data.check){
                                    details.name=null;
                                    details.Specialization=null;
                                    ($scope.example9model.length>0)?($scope.example9model.splice(0,$scope.example9model.length)):(null);
                                    ($scope.example11model.length>0)?($scope.example11model.splice(0,$scope.example9model.length)):(null);
                                    $scope.example10model.splice(0,$scope.example10model.length);
                                    alert("department created  sucessfully");
                                }else{
                                    alert("department already exist");
                                }
                            }).catch(function(err){
                                console.log(err);
                            })
                        }else if(course.includes("BE") && course.length==1 && $scope.example11model.length>0 && $scope.example9model.length==0){
                            console.log($scope.example11model.length,$scope.example9model.length)
                            var data={
                                deptname:details.name,
                                deptcourse:$scope.example10model,
                                deptSpecialization:details.Specialization,
                                deptsemesterfor:[$scope.example11model],
                                // deptsemesterforME:$scope.example11model,
                            }
                            userService.addDepartment(data).then(function(res){
                                if(!res.data.check){
                                    details.name=null;
                                    details.Specialization=null;
                                    // ($scope.example9model.length>0)?($scope.example9model.splice(0,$scope.example9model.length)):(null);
                                    ($scope.example11model.length>0)?($scope.example11model.splice(0,$scope.example9model.length)):(null);
    
                                    // $scope.example9model.splice(0,$scope.example9model.length);
                                    $scope.example10model.splice(0,$scope.example10model.length);
                                    // $scope.example11model.splice(0,$scope.example10model.length);
                                    alert("department created  sucessfully");
                                }else{
                                    alert("department already exist");
                                }
                            }).catch(function(err){
                                console.log(err);
                            })
                        }else if(course.includes("ME") && course.length==1 && $scope.example9model.length>0 && $scope.example11model.length==0){
                            console.log("mE",)
                            console.log($scope.example9model);
                            console.log($scope.example11model);
                            var data={
                                deptname:details.name,
                                deptcourse:$scope.example10model,
                                deptSpecialization:details.Specialization,
                                // deptsemesterforBE:$scope.example9model,
                                deptsemesterfor:[$scope.example9model],
                            }
                            userService.addDepartment(data).then(function(res){
                                if(!res.data.check){
                                    details.name=null;
                                    details.Specialization=null;
                                    ($scope.example9model.length>0)?($scope.example9model.splice(0,$scope.example9model.length)):(null);
                                    // ($scope.example11model.length>0)?($scope.example11model.splice(0,$scope.example9model.length)):(null);
    
                                    // $scope.example9model.splice(0,$scope.example9model.length);
                                    $scope.example10model.splice(0,$scope.example10model.length);
                                    // $scope.example11model.splice(0,$scope.example10model.length);
                                    alert("department created  sucessfully");
                                }else{
                                    alert("department already exist");
                                }
                            }).catch(function(err){
                                console.log(err);
                            })
                        }else{
                            alert("Please review form");
                        }
                        
                    }else{
                        alert("Please review form");
                    }
                }
                $scope.addsemester=function(item){
                    if($scope.example8model.length>0 && item.dept && item.Specialization && item.Course){
                        var data={
                            deptname:item.dept,
                            speci:item.Specialization,
                            course:item.Course,
                            semesters:$scope.example8model
                        };
                        userService.addsemesters(data).then(function(res){
                            if(res.data.check){
                                alert("added sucessfully")
                                item.dept=null;
                                item.Specialization=null;
                                item.Course=null;
                                $scope.example8model.splice(0,$scope.example8model.length)
                            }else{
                                alert("please review");
                            }

                        }).catch(function(err){
                            console.log(err);
                        })
                    }else{
                        alert("Please review")
                    }
                }
            }
        }else{
            $state.go("login");
        }
    }
})();