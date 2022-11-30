(function () {
    'use strict';
 
    angular
        .module('app')
        .service('userService', userService);
    
    userService.$inject = ['$http', 'globalConfig'];
    function userService($http, globalConfig) {
        
        var service = {};
        service.test1=test1;
        service.deletespec=deletespec;
        service.addrooms=addrooms;
        service.getrooms=getrooms;
        service.deleteroom=deleteroom;
        service.getdeptrooms=getdeptrooms;
        service.getfac=getfac;
        service.addfaculty=addfaculty;
        service.deletedata=deletedata;
        service.updatefac=updatefac;
        service.getdept=getdept;
        service.timetable=timetable;
        service.Login = Login;
        service.test = test;
        service.Logout=Logout;
        service.GetTaskList=GetTaskList;
        service.ChangePass=ChangePass;
        service.VeryPass=VeryPass;
        service.EditUserStatus=EditUserStatus;
        service.GetTaskTypeList=GetTaskTypeList;
        service.gettableh=gettableh;
        service.custom=custom;
        service.getweekrpt=getweekrpt;
        service.allotwithprevious=allotwithprevious;
        service.subinfo=subinfo;
        service.facdayinfo=facdayinfo;
        service.facavb=facavb;
        service.getsubjectname=getsubjectname;
        service.facallotment=facallotment;
        service.clearFacSubAllot=clearFacSubAllot;
        service.undo=undo;
        service.getelement=getelement;
        service.finalinsert=finalinsert;
        service.viewfac=viewfac;
        service.active=active;
        service.deletefac=deletefac;
        service.addsubject=addsubject;
        service.getusers=getusers;
        service.adduser=adduser;
        service.deleteuser=deleteuser;
        service.deactivateuser=deactivateuser;
        service.Changepassword=Changepassword;
        service.addDepartment=addDepartment;
        service.addsemesters=addsemesters;
        service.deactivate=deactivate;
        service.activaterole=activaterole;
        service.getarchives=getarchives;
        service.deleteshedule=deleteshedule;
        service.deletearchive=deletearchive;
        //
        service.additem=additem;
        //
        return service;
        //
        function additem(item){
            return $http.post(globalConfig.additem,item).then(handleSuccess , handleError("Eroor "));
        }
        //
        function addrooms(details){
            return $http.post(globalConfig.addrooms,details).then(handleSuccess , handleError("Eroor "));
        }
        function deleteroom(details){
            return $http.post(globalConfig.deleteroom,details).then(handleSuccess , handleError("Eroor "));
        }
        function deletespec(details){
            return $http.post(globalConfig.deletespec,details).then(handleSuccess , handleError("Eroor "));
        }
        function getrooms(){
            return $http.post(globalConfig.getrooms).then(handleSuccess , handleError("Eroor "));
        }
        function getdeptrooms(item){
            return $http.post(globalConfig.getdeptrooms,item).then(handleSuccess , handleError("Eroor "));
        }
        function activaterole(item){
            return $http.post(globalConfig.activaterole,item).then(handleSuccess , handleError("Eroor "));
        }
        function deleteshedule(item){
            return $http.post(globalConfig.deleteshedule,item).then(handleSuccess , handleError("Eroor "));
        }
        function deletearchive(item){
            return $http.post(globalConfig.deletearchive,item).then(handleSuccess , handleError("Eroor "));
        }
        function getarchives(item){
            return $http.post(globalConfig.getarchives,item).then(handleSuccess , handleError("Eroor "));
        }
        function addsemesters(item){
            return $http.post(globalConfig.addsemesters,item).then(handleSuccess , handleError("Eroor "));
        }
        function deactivate( ){
            return $http.post(globalConfig.deactivate).then(handleSuccess , handleError("Eroor "));
        }
        function addDepartment(item){
            return $http.post(globalConfig.addDepartment,item).then(handleSuccess , handleError("Eroor "));
        }
        function Changepassword(item){
            return $http.post(globalConfig.Changepassword,item).then(handleSuccess , handleError("Eroor "));
        }
        function getsubjectname(item){
            return $http.post(globalConfig.getsubjectname,item).then(handleSuccess , handleError("Eroor "));
        }
        function deactivateuser(item){
            return $http.post(globalConfig.deactivateuser,item).then(handleSuccess , handleError("Eroor "));
        }
        function deleteuser(item){
            return $http.post(globalConfig.deleteuser,item).then(handleSuccess , handleError("Eroor "));
        }
        function adduser(item){
            return $http.post(globalConfig.adduser,item).then(handleSuccess , handleError("Eroor "));
        }
        function getusers(){
            return $http.post(globalConfig.getusersAPI).then(handleSuccess, handleError('Error getting data'));
        }
        function addsubject(item){
            return $http.post(globalConfig.addsubject,item).then(handleSuccess, handleError('Error getting data'));
        }
        function deletefac(item){
            return $http.post(globalConfig.deletefac,item).then(handleSuccess, handleError('Error getting data'));
        }
        function viewfac(item){
            return $http.post(globalConfig.viewfac,item).then(handleSuccess, handleError('Error getting data'));
        }
        function active(item){
            return $http.post(globalConfig.active,item).then(handleSuccess, handleError('Error getting data'));
        }
        function getfac(){
            return $http.post(globalConfig.getfac).then(handleSuccess, handleError('Error getting data'));
        }
        function addfaculty(details){
            return $http.post(globalConfig.addfaculty,details).then(handleSuccess, handleError('Error getting data'));
        }
        function deletedata(details){
            return $http.post(globalConfig.deletedata,details).then(handleSuccess, handleError('Error getting data'));
        }
        function test1(details){
            return $http.post(globalConfig.test1,details).then(handleSuccess, handleError('Error getting data'));
        }
        function finalinsert(details){
            return $http.post(globalConfig.finalinsertAPI,details).then(handleSuccess, handleError('Error getting data'));
        }
        function getelement(details){
            return $http.post(globalConfig.getelementAPI,details).then(handleSuccess, handleError('Error getting data'));
        }
        function undo(details){
            return $http.post(globalConfig.undoAPI,details).then(handleSuccess, handleError('Error getting data'));
        }
        function allotwithprevious(item){
            return $http.post(globalConfig.allotwithprevious,item).then(handleSuccess, handleError('Error getting data'));
        }
        function clearFacSubAllot(details){
            return $http.post(globalConfig.clearFacSubAllot,details).then(handleSuccess, handleError('Error getting data'));
        }
        function updatefac(details){
            return $http.post(globalConfig.updatefacAPI,details).then(handleSuccess, handleError('Error getting data'));
        }
        function facavb(details) {
            return $http.get(globalConfig.facavbAPI,{params: details}).then(handleSuccess, handleError('Error getting all user'));
        }
        function facallotment(details){
            return $http.post(globalConfig.facallotment,details).then(handleSuccess, handleError('Error getting data'));
        }
        function facdayinfo(details) {
            return $http.get(globalConfig.facdayinfoApi,{params: details}).then(handleSuccess, handleError('Error getting all user'));

        }
        function subinfo(details) {
            return $http.get(globalConfig.subinfoAPI,{params: details}).then(handleSuccess, handleError('Error getting all user'));

        }
        function getweekrpt(details) {
            return $http.post(globalConfig.getweekrptAPI,details).then(handleSuccess, handleError('Error getting all user'));

        }
        function custom() {
            return $http.post(globalConfig.custom).then(handleSuccess, handleError('Error getting all user'));

        }
        function getdept() {
            return $http.post(globalConfig.getdeprt).then(handleSuccess, handleError('Error getting all user'));

        }
        function gettableh(user) {
            return $http.post(globalConfig.gettableh,user).then(handleSuccess, handleError('Error getting all user'));

        }
        function timetable(user) {
            return $http.post(globalConfig.timetabledept , user).then(handleSuccess, handleError('Error getting all user'));

        }
        function test(user) {
            return $http.get(globalConfig.timetableAPI).then(handleSuccess, handleError('Error getting all user'));

        }
         function GetTaskTypeList(user) {
            return $http.get(globalConfig.getTaskTypeListApi,{params : user}).then(handleSuccess, handleError('Error getting all user'));

        }
        function Login(user) {
            return $http.post(globalConfig.userLoginApi, user).then(handleSuccess, handleError('Error deleting user'));
        }
        function handleSuccess(res) {
            return res.data;
        }
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
        function Logout(user){
           // alert("logout service");
            return $http.get(globalConfig.userLogoutApi,user).then(handleSuccess, handleError('Error destroying session'));
        }
        function GetTaskList(user){
            //alert("alert");
            return $http.get(globalConfig.userDashboardApi, {params : user}).then(handleSuccess,handleError("Error listing tasks")); 
        }
         function ChangePass(user){
            //alert("entered service part");
            return $http.post(globalConfig.userChangePassApi,user).then(handleSuccess,handleError("Error changing password"));
        }
         function VeryPass(user){
            //alert("entered service part");
            return $http.post(globalConfig.userVeryPassApi,user).then(handleSuccess,handleError("Error changing password"));
        }
         function EditUserStatus(user){
            //alert("entered service part");
            return $http.post(globalConfig.userEditStatusApi,user).then(handleSuccess,handleError("Error changing password"));
        }
    }
})();