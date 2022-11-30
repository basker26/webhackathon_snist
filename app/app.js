(function() {
    'use strict';

    angular.module('app', [
            "ui.router",
            "ngStorage",
            '720kb.datepicker',
            'ngFileUpload',
            'angular.filter',
            'angularjs-dropdown-multiselect'
        ])
        .config(function($stateProvider, $urlRouterProvider) {
            //$urlRouterProvider.otherwise("/");
            $urlRouterProvider.otherwise(function($injector,$location){
                var $state=$injector.get('$state'); 
                $state.go('home');
            });
            
            $stateProvider.state("login", {
                url: "/login",
                templateUrl: "/views/user/login.html",
                controller: "loginController"
            }).state("logout", {
                url: "/logout",
                templateUrl: "/views/user/logout.html",
                controller: "logoutController"
            }).state("home", {
                url: "/home",
                templateUrl: "/views/user/home.html",
                controller: "dashboardController"
               
            })
            .state("checkstatus",{
                url:"/check",
                templateUrl:"/views/user/chceck.html",
                controller:"checkstatus"
            })
          
           //to be present 
            .state("managecontract", {
                parent:"home",
                url: "/hr/managecontract",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/hr_cell/contractorSelector.html",
                        controller: "hrcellController"
                    }   
                }
            
            })
            .state("Schedule TimeTable", {
                parent:"home",
                url: "/edit/timetable",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/timetablesetter/edit.html",
                        controller: "timetableedit"
                    }   
                }
            
            })
            .state("Change Password", {
                parent:"home",
                url: "/changepassword",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/timetablesetter/changepassword.html",
                        controller: "changepass"
                    }   
                }
            
            })
            .state("Add faculty", {
                parent:"home",
                url: "/edit/Addfaculty",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/timetablesetter/facultyadd.html",
                        controller: "addfacc"
                    }   
                }
            
            })
            .state("setprefered", {
                parent:"home",
                url: "/set/prefered",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/timetablesetter/prefered.html",
                        controller: "prefered"
                    }   
                }
            
            })
            //
            .state("viewitem", {
                parent:"home",
                url: "/view/viewitem",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/user/viewitem.html",
                        controller: "fagController"
                    }   
                }
            
            })
            //
            .state("customsearch", {
                parent:"home",
                url: "/view/custom",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/user/custom.html",
                        controller: "hrcellController"
                    }   
                }
            
            })
         

               //to present 
                    .state("conreg", {
                        parent:"home",
                        url: "/hr/contractorregistration",
                        views: {
                            'tasks@home':{
                                templateUrl: "/views/hr_cell/contractorRegistration.html",
                                controller: "hrcellController"
                            }   
                        }
                    
                    })
                    .state("viewprofile", {
                        parent:"home",
                        url: "/home/viewprofile",
                        views: {
                            'tasks@home':{
                                templateUrl: "/views/user/profile.html",
                                controller: "hrcellController"
                            }   
                        }
                    
                    })
          
            //to present 
            .state("faculty",{
                parent:"home",
                url:"home/faculty",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/faculty.html",
                        controller:"faculty"
                    }
                }
            })
            .state("Add subjects",{
                parent:"home",
                url:"home/subjects",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/addsubjects.html",
                        controller:"addsub"
                    }
                }
            })
            .state("Add Department",{
                parent:"home",
                url:"home/Department",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/addDepartment.html",
                        controller:"addDept"
                    }
                }
            })
            .state("Dept details",{
                parent:"home",
                url:"home/rooms",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/deptdetails.html",
                        controller:"build"
                    }
                }
            })
            .state("User Managemnt",{
                parent:"home",
                url:"home/userManagment",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/usermanagment.html",
                        controller:"usermanag"
                    }
                }
            })
            .state("Clear Timetable",{
                parent:"home",
                url:"home/ClearTimetable",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/timetablesetter/deleteSchedule.html",
                        controller:"deletedata"
                    }
                }
            })
            .state("Add items",{
                parent:"home",
                url:"home/additems",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/user/additems.html",
                        controller:"Additems"
                    }
                }
            })
            .state("processbill",{
                parent:"home",
                url:"/process/bill",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/user/processBill.html",
                        controller:"fagController"
                    }
                }
            })
         
       
            
          
   
           
   
        })
        .constant("globalConfig", {
            //
            additem:'http://localhost:4000/api/user/additem',
            //
            deletedata:'http://localhost:4000/api/user/deletedata',
            test1:'http://localhost:4000/api/user/test1',
            finalinsertAPI:'http://localhost:4000/api/user/finalinsertAPI',
            getelementAPI:'http://localhost:4000/api/user/getelementAPI',
            undoAPI:'http://localhost:4000/api/user/undoAPI',
            updatefacAPI:'http://localhost:4000/api/user/updatefacAPI',
            allotwithprevious:'http://localhost:4000/api/user/allotwithprevious',
            clearFacSubAllot:'http://localhost:4000/api/user/clearFacSubAllot',
            facallotment: 'http://localhost:4000/api/user/facallotment',
            facavbAPI:'http://localhost:4000/api/user/facavb',
            getsubjectname:'http://localhost:4000/api/user/getsubjectname',
            facdayinfoApi:'http://localhost:4000/api/user/facdayinfo',
            subinfoAPI:'http://localhost:4000/api/user/subinfo',
            getweekrptAPI:'http://localhost:4000/api/user/weekreport',
            custom:'http://localhost:4000/api/user/custom',
            getdeptrooms:'http://localhost:4000/api/user/getdeptrooms',
            gettableh:'http://localhost:4000/api/user/gettablecourse',
            getdeprt:'http://localhost:4000/api/user/getdepart',
            timetabledept: 'http://localhost:4000/api/user/timetabledeprt',
            timetableAPI: 'http://localhost:4000/api/user/timetable',
            userLoginApi: 'http://localhost:4000/api/user/login',
            userDashboardApi:'http://localhost:4000/api/user/home',
            getTaskTypeListApi:'http://localhost:4000/api/user/home/tasktypedetails',
            userLogoutApi: 'http://localhost:4000/api/user/home/logout',
            addfaculty:'http://localhost:4000/api/user/addfaculty',
            getfac:'http://localhost:4000/api/user/getfac',
            viewfac:'http://localhost:4000/api/user/viewfac',
            active:'http://localhost:4000/api/user/active',
            deletefac:'http://localhost:4000/api/user/deletefac',
            addsubject:'http://localhost:4000/api/user/addsubject',
            getusersAPI:'http://localhost:4000/api/user/getusersAPI',
            adduser:'http://localhost:4000/api/user/adduser',
            deactivateuser:'http://localhost:4000/api/user/deactivateuser',
            deleteuser:'http://localhost:4000/api/user/deleteuser',
            Changepassword:'http://localhost:4000/api/user/Changepassword',
            addDepartment:'http://localhost:4000/api/user/addDepartment',
            getrooms:'http://localhost:4000/api/user/getrooms',
            deleteroom:'http://localhost:4000/api/user/deleteroom',
            addsemesters:'http://localhost:4000/api/user/addsemesters',
            deactivate:'http://localhost:4000/api/user/deactivate',
            activaterole:'http://localhost:4000/api/user/activaterole',
            getarchives:'http://localhost:4000/api/user/getarchives',
            addrooms:'http://localhost:4000/api/user/addrooms',
            deleteshedule:'http://localhost:4000/api/user/deleteshedule',
            deletearchive:'http://localhost:4000/api/user/deletearchive',
            deletespec:'http://localhost:4000/api/user/deletespec'
        }).run(run);

    run.$inject = ['$rootScope','$localStorage'];

    function run($rootScope, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.userData) {
                $rootScope.userLogin = true;
                if($localStorage.userData.rolename == 'ADMIN') {
                    $rootScope.isAdmin = true;
                 //   $rootScope.name=$localStorage.userData.name;
                }
            }else {
                 $rootScope.userLogin = false;
                 $rootScope.isAdmin = false;
            }
    }
})();
