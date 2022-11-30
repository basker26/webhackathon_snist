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
            
            .state("Change Password", {
                parent:"home",
                url: "/changepassword",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/managment/changepassword.html",
                        controller: "changepass"
                    }   
                }
            
            })
            //
            .state("viewitem", {
                parent:"home",
                url: "/view/viewitem",
                views: {
                    'tasks@home':{
                        templateUrl: "/views/user/viewitems.html",
                        controller: "fagController"
                    }   
                }
            
            })
            //
           
            .state("User Managemnt",{
                parent:"home",
                url:"home/userManagment",
                views:{
                    'tasks@home':{
                        templateUrl:"/views/managment/usermanagment.html",
                        controller:"usermanag"
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
   
        })
        .constant("globalConfig", {
            //
            additem:'http://localhost:4000/api/user/additem',
            //
            getusersAPI:'http://localhost:4000/api/user/getusersAPI',
            bycategory:'http://localhost:4000/api/user/bycategory',
            viewitemAPI: 'http://localhost:4000/api/user/viewitemAPI',
            userLoginApi: 'http://localhost:4000/api/user/login',
            userDashboardApi:'http://localhost:4000/api/user/home',
            getTaskTypeListApi:'http://localhost:4000/api/user/home/tasktypedetails',
            userLogoutApi: 'http://localhost:4000/api/user/home/logout',
            adduser:'http://localhost:4000/api/user/adduser',
            Changepassword:'http://localhost:4000/api/user/Changepassword',
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
