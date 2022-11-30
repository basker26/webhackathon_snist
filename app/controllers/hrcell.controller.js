(function() {
    'use strict';

    angular
        .module('app')
        .controller('hrcellController', Controller)
        ;

    Controller.$inject = ['$scope', '$rootScope', 'userService', '$state', '$stateParams', '$localStorage', '$window'];

    function Controller($scope, $rootScope, userService, $state, $stateParams, $localStorage,$window) {

             if($state.current.name == "customsearch"){
              // screen.orientation.lock('landscape')
              if($rootScope.week){
                if($rootScope.week.set){
                  console.log($rootScope.week);
                  userService.getweekrpt($rootScope.week).then(function(res){
                    $scope.weekdata=res.data;
                    // console.log(res.data);
                    $rootScope.week.set=false;
                }).catch(function(err){
                  console.log(err);
                });
                }
                    
              }else if($localStorage.week){
                console.log($localStorage.week)
                userService.getweekrpt($localStorage.week).then(function(res){
                  $scope.weekdata=res.data;
                  // console.log(res.data);
               }).catch(function(err){
                 console.log(err);
               });
              }
              
              userService.custom().then(function(res) { 
                     $scope.filterdata=res.data;
                     console.log($scope.filterdata);
              }).catch(function(err){
               console.log(err);
             //  errorMessage(err);
             }); 
             $scope.export = function() {
 
              if (!$window.Blob) {
                 alert('Your legacy browser does not support this action.');
                 return;
              }
           
              var html=angular.element(document.querySelector('#exportthis'))[0].innerHTML;
              var html1=angular.element(document.querySelector('#exportthis1'))[0].innerHTML;
              var html2=angular.element(document.querySelector('#exportthis2'))[0].innerHTML;


              
              var link, blob, url, css;
              var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                        "xmlns='http://www.w3.org/TR/REC-html40'>" +
                        "<head><meta charset='utf-8'><title>Export Table to Word</title></head><body>";
              var footer = "</body></html>";
              var sourceHTML = header + "<table border='1' cellpadding='1' cellspacing='1'>" + html + "</table>" + "<table border='1' cellpadding='1' cellspacing='1'>" + html1 + "</table>"+"<table border='1' cellpadding='1' cellspacing='1'>" + html2 + "</table>"+footer;
              var sourceHTML1 = header + "<table border='1' cellpadding='1' cellspacing='1'>" + html1 + "</table>" + footer;
              var sourceHTML2 = header + "<table border='1' cellpadding='1' cellspacing='1'>" + html2 + "</table>" + footer;

              // EU A4 use: size: 841.95pt 595.35pt;
              // US Letter use: size:11.0in 8.5in;
              
              css = (
                '<style>' +
                '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
                'div.WordSection1 {page: WordSection1;}' +
                'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;}'+
                '</style>'
              );
              
              // html = angular.element(document.querySelector('#exportthis'))[0].innerHTML;
              blob = new Blob([css+sourceHTML], {
                type: 'application/msword'
              });
              url = URL.createObjectURL(blob);
              link = document.createElement('A');
              link.href = url;
              // Set default file name. 
              // Word will append file extension - do not add an extension here.
              link.download = 'Document';   
              document.body.appendChild(link);
              if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
                  else link.click();  // other browsers
              document.body.removeChild(link);
            };
            //  $scope.export = function(){
            //   // var divToPrint=document.getElementById("exportthis");
            //   // // var divToPrint = document.getElementById('SomeDivId');
            //   // var newWin = window.open('', 'Print-Window');
            //   // newWin.document.open();
            //   // newWin.document.write('<html><head>' + document.head.innerHTML + '</head><body onload="window.print();setTimeout(function(){window.close();}, 100);">' + divToPrint.innerHTML + '</body></html>'); newWin.document.close();
            //   html2canvas(document.getElementById('exportthis'), {
            //     onrendered: function (canvas) {
            //         var data = canvas.toDataURL();
            //         var docDefinition = {
            //             pageOrientation: 'landscape',
            //             content: [{
            //                image: data,
            //                   width: 750,
            //                   height: 400
            //             }]
            //         };
            //         pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            //     }
            // });
            // }
             $scope.seggregate=function(item){
              console.log(new Date().getHours());
              if(item.p1==item.p2&&item.p2==item.p3&&item.p3==item.p4){
                  item.p1b=true;
                  item.p1col=4;
                  item.p2b=false;
                  item.p3b=false;
                  item.p4b=false;
                  item.p1t=[9,13]
                  console.log(14,item)
              }
              if(item.p1==item.p2&&item.p2==item.p3&&item.p3!=item.p4){
                  item.p1b=true;
                  item.p1col=3;
                  item.p2b=false;
                  item.p3b=false;
                  item.p4b=true;
                  item.p4col=1;
                  item.p1t=[9,12];
                  item.p4t=[12,13];
                  console.log(31,item)
                }
              if(item.p1==item.p2&&item.p2!=item.p3&&item.p3!=item.p4){
                  item.p1b=true;
                  item.p1col=2;
                  item.p2b=false;
                  item.p3b=true;
                  item.p3col=1;
                  item.p4b=true;
                  item.p4col=1;
                  item.p1t=[9,11];
                  item.p3t=[11,12];
                  item.p4t=[12,13];
                  // console.log("211",item)
              }
              if(item.p1!=item.p2&&item.p2==item.p3&&item.p3!=item.p4){
                  item.p1b=true;
                  item.p1col=1;
                  item.p2b=true;
                  item.p2col=2;
                  item.p3b=false;
                  item.p4b=true;
                  item.p4col=1;
                  item.p1t=[9,10];
                  item.p2t=[10,12];
                  item.p4t=[12,13];
                  console.log(121,item)
              }
              if(item.p1!=item.p2&&item.p2==item.p3&&item.p3==item.p4){
                  item.p1b=true;
                  item.p1col=1;
                  item.p2b=true;
                  item.p2col=3;
                  item.p3b=false;
                  item.p4b=false;
                  item.p1t=[9,10];
                  item.p2t=[10,13];
                  console.log(13,item)
              }
              if(item.p1==item.p2&&item.p2!=item.p3&&item.p3==item.p4){
                  item.p1b=true;
                  item.p1col=2;
                  item.p2b=false;
                  item.p3b=true;
                  item.p3col=2;
                  item.p4b=false;
                  item.p1t=[9,11];
                  item.p3t=[11,13];
                  console.log(22,item)
              }
              if(item.p1!=item.p2&&item.p2!=item.p3&&item.p3!=item.p4){
                  item.p1b=true;
                  item.p1col=1;
                  item.p2b=true;
                  item.p2col=1;
                  item.p3b=true;
                  item.p3col=1;
                  item.p4b=true;
                  item.p4col=1;
                  item.p1t=[9,10];
                  item.p2t=[10,11];
                  item.p3t=[11,12];
                  item.p4t=[12,13];
                  console.log(1111,item)
              }
              if(item.p1!=item.p2&&item.p2!=item.p3&&item.p3==item.p4){
                item.p1b=true;
                item.p1col=1;
                item.p2b=true;
                item.p2col=1;
                item.p3b=true;
                item.p3col=2;
                item.p4b=false;
                item.p1t=[9,10]
                item.p2t=[10,11];
                item.p3t=[11,13];
                // item.p4col=1;
                // console.log(1111,item)
            }
    
    
              if(item.p6==item.p7&&item.p7==item.p8){
                  item.p6b=true;
                  item.p6col=3;
                  item.p7b=false;
                  item.p8b=false;
                  item.p6t=[14,17];
              }
              if(item.p6==item.p7&&item.p7!=item.p8){
                  item.p6b=true;
                  item.p6col=2;
                  item.p7b=false;
                  item.p8b=true;
                  item.p8col=1;
                  item.p6t=[14,16];
                  item.p8t=[16,17];
              }
              if(item.p6!=item.p7&&item.p7==item.p8){
                  item.p6b=true;
                  item.p6col=1;
                  item.p7b=true;
                  item.p7col=2;
                  item.p8b=false;
                  item.p6t=[14,15];
                  item.p7t=[15,17];
                  
              }
              if(item.p6!=item.p7&&item.p7!=item.p8){
                  item.p6b=true;
                  item.p6col=1;
                  item.p7b=true;
                  item.p7col=1;
                  item.p8b=true;
                  item.p8col=1;
                  item.p6t=[14,15];
                  item.p7t=[15,16];
                  item.p8t=[16,17];
              }
             }
             $scope.getweekrpt=function(details){
                 var detail={
                   id:details.sem
                 }
                 userService.getweekrpt(detail).then(function(res){
                    $scope.weekdata=res.data;
                    console.log($scope.weekdata)
                 }).catch(function(err){
                   console.log(err);
                 });
             }
             }else
              if($state.current.name == "conreg"){
                  var array=[];
                  userService.test($rootScope.User).then(function(res) { 
      
                    $scope.test=res.data;
                    $scope.test.forEach(element => {
                      var arr = Object.entries(element);
                      array.push(arr);
                      
                    });
                  
                      //  $scope.segregate(array[0]);
                    
                    // console.log(array);
      
      
               }).catch(function(err){
                   console.log(err);
                 //  errorMessage(err);
              }); 
               $scope.segregate=function(item){
              if(item.p1==item.p2){
                if(item.p2==item.p3){
                  if(item.p3==item.p4){
                   item.p1b=true;
                   item.p1col=4;
                  //  console.log( item.p1b,item.p1col)
                  }else{
                    item.p1b=true;
                    item.p1col=3
                    item.p2b=false;
                    item.p3b=false;
                    // console.log(item.p1b,item.p1col,item.p2b,item.p3b);
                  }
                

                }else{ item.p1b=true;
                  item.p1col=2
                  item.p2b=false;
                  // console.log(item.p1col,item.p2b);
                  }
               

              } else{
                item.p1b=true;
                item.p1col=1;
                console.log(item.p1b,item.p1col);
              }
              if(item.p1col==1){
                if(item.p2==item.p3 && item.p1col==1){
                  // console.log(item.p1col);
                  if(item.p3==item.p4){
                    item.p2b=true;
                    item.p2col=3;
                    item.p3b=false;
                    item.p4b=false;
                    // console.log(item.p2b,item.p2col,item.p3b,item.p4b)
                  }else{   item.p2b=true;
                    item.p2col=2;
                    item.p3b=false;
                    // console.log(item.p2b,item.p2col,item.p3b)
                  }
               
                }else{
                  item.p2b=true;
                  item.p2col=1;
                  // console.log(item.p2b, item.p2col)
                }
              }
            if(!item.p3b){
              if(item.p3==item.p4){
                item.p3b=true;
                item.p3col=2;
                // console.log( item.p3b,item.p3col)
              }else{
                if(item.p1b==false && item.p2col==2){
                  item.p3b=false;
                   item.p4b=true;
                  item.p4col=1;
                  
                }else{
                  item.p3b=true;
                  item.p4b=true;
                  item.p3col=1;
                  item.p4col=1;
                  // console.log(item.p3b, item.p4b, item.p3col,item.p4col)
                }
               
              }
            }
             
              if(item.p6==item.p7){
                if(item.p7==item.p8){
                  item.p6b=true;
                  item.p6col=3;
                  item.p7b=false;
                  item.p8b=false;
                  // console.log(item.p6b,item.p6col,item.p7b,item.p8b)
                }else{
                  item.p6b=true;
                  item.p6col=2;
                  item.p7b=false;
                  // console.log(item.p6b, item.p6col,item.p7b);
                }

              }else{
                item.p6b=true;
                item.p6col=1;
                // console.log( item.p6b,item.p6col)
              }if(item.p6cols==1){
                if(item.p7==item.p8 && item.p6col==1){
                  item.p7b=true;
                  item.p7col=2;
                  item.p8b=false;
                  // console.log(item.p7b,item.p7col,item.p8b)
                }else{
                  item.p7b=true;
                  item.p7col=1;
                  item.p8b=true;
                  item.p8col=1;
                  // console.log(item.p7b,item.p7col, item.p8b,item.p8col)
                }
              }
             
              console.log(item);
               }

              }  else  if($state.current.name ==  "viewprofile"){
   
                console.log($rootScope.User.gender);
              if($rootScope.User.gender=="male"){
                $rootScope.User.gender1=false;
              } else{$rootScope.User.gender1=true;}
              console.log($rootScope.User.gender1);
                
                
                
                }

    // }else $state.go("login");

}
        


        function successMessage(message) {
            $(".success").removeClass("in").show();
            $(".success").delay(200).addClass("in").fadeOut(3000);
            $rootScope.message = message;
        }
        function errorMessage(message){
            $(".error").removeClass("in").show();
            $(".error").delay(200).addClass("in").fadeOut(3000);
            $rootScope.message = message;
        }
    
 
}) ();