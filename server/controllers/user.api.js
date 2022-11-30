var express = require("express"),
    session= require("express-session"),
    router = express.Router(),
    url = require('url');
const { uuid } = require('uuidv4');
const { v4: uuidv4 } = require('uuid');
const { connect } = require("net");
const { data} = require("jquery");
const { includes } = require("underscore");
const timestamp = require('time-stamp'),
    dbConnection = require("../config/dbConnection.js"),
    connection = dbConnection.getConnection();// for database connection.


router.post("/login",function(req,res){
    console.log(req.body);
    var obj =req.body;
    var timeinn;
    var usrid=obj.userName;
    var password=obj.password;
    var role;
    var validity =1;
    var check=0;
    var finalData={};
    connection.query('Select * from users where user_id = ? and password = MD5(?) and valid = ? ', [usrid, password,validity], function(err, data){
        if(err){
               (err)
            return;
        }
        else{
            if(data.length==0)
                res.send(response(false,"Wrong Username/ Password",null));
            else {
                var user_id=data[0].user_id;
                var roleId;
                req.session.data=data[0];
                connection.query('Select * from usersession where userId =?',[user_id],function(err,result){
                    if(err){
                        result.send("error");
                        return ;
                    }
                    else{
                        // console.log(result);
                        if(result.length==0){ 
                          console.log("ur on crt way"); 
                           var timein= timestamp('YYYY-MM-DD HH:mm:ss');
                           req.session.sessionId=req.sessionId;
                           req.session.loggedIn=true;
                           connection.query("insert into usersession(session_id,userId,loginStatus,timein)values('"+ req.sessionID+"','"+ user_id+"',1,'"+timein+"')" ,function(err,result){
                                if(err) throw err;
                                    // console.log("error:" + err);
                                else{
                                    console.log(result);
                                    connection.query("select * from usersession where userId='"+user_id+"'",function(err,datas){
                                        if(err) throw err;
                                            // console.log("error:"+err);
                                        else{ 
                                            timeinn=datas[0].timeIn;
                                        }
                                })
                                    // req.session.sessionId=res[0].session_id;
                                }
                           }); 
                        }
                        else{
                            connection.query("update usersession set timein='"+timestamp('YYYY-MM-DD HH:mm:ss')+"'where userId='"+user_id+"'", function(err,res){
                                if(err) throw err;    
                                else{
                                    // console.log("it great to have before")
                                    connection.query("select * from usersession where userId='"+user_id+"'",function(err,res){
                                        if(err)
                                               ("error:"+err);
                                        else{
                                             timeinn=res[0].timeIn;
                                             req.session.sessionId=res[0].session_id;
                                             
                                        }
                                    })
                                }       

                            })
                        }
                    }    
                })
                ///////
                // connection.query("select timeIn from usersession where userId='"+user_id+"'",function(err,datas){
                //         if(err) throw err;
                //             // console.log("error:"+err);
                //         else{ 
                //             timein=datas[0].timeIn;
                //         }
                // })
                            // console.log(datas,"mental hero")
                    connection.query('Select roleid from user_role_mapping where userid= ?',[user_id] ,function(err,result){
                        if(err)
                               (err);
                        else{
                        if(result.length==1){
                            roleId=result[0].roleid;
                            connection.query('SeLect * from processrole where id=?',[roleId] ,function(err,roleresult){
                                if(err)
                                       (err);
                                else if(roleresult.length==1){
                                   //    (data[0].user_id)
                                    connection.query('SELECT  name FROM clmsdb.persons , clmsdb.users where persons.codeno = users.emp_codeno and users.user_id = ?' , [data[0].user_id], function(err, data5){
                                       
                                       
                                        if(err) throw err;
                                        else{
                                        console.log(data5);
                                        if(data5.length==0){
                                            console.log("done")
                                            connection.query("SELECT * FROM clmsdb.faculty_info where id=?",[data[0].user_id],function(err,dataa){
                                                if(err) throw err;
                                                else{
                                                    // console.log(dataa);
                                                    finalData={
                                                        userId: data[0].user_id,
                                                        rolename:  roleresult[0].name,
                                                        roleId: roleId,
                                                        roledesc : roleresult[0].description,
                                                        timein : timeinn,
                                                        name:dataa[0].name,
                                                    }
                                                    req.session.data.roleid=roleresult[0].id;
                                    console.log(finalData);
                                    res.send(response(true,"success",finalData));
                                                }
                                            });    
                                        }
                                        else {                     
                                            finalData={
                                            userId: data[0].user_id,
                                            rolename:  roleresult[0].name,
                                            roleId: roleId,
                                            name: data5[0].name,
                                            // DOB: data5[0].dob,
                                            // gmail: data5[0].email_id,
                                            // mobile_no:data5[0].mobile,
                                            codeno : data[0].emp_codeno,
                                            roledesc : roleresult[0].description,
                                            timein : timeinn,
                                            // gender:data5[0].gender
                                            
        
                                            }
                                            req.session.data.roleid=roleresult[0].id;
                                    console.log(finalData);
                                    res.send(response(true,"success",finalData));
    
                                    }
                                }
                                    
                                });
                                }
                            });
                        }
                        }
                    });
                //     }
                // });
                /////////
            }
        }
    });
})

.post("/home/role",checkSignIn,function(req,res){
    var obj =req.body;
    var name=obj.roleName;
    var desc=obj.roleDescription;

    //creating and saving new roles in the database.
    connection.query( 'select * from processrole where name= ?',[name],function(err,data){
        if(err)
               ("error:"+err);
        else{
            if(data.length==0){
               connection.query("insert into processrole(description,reportingrole) values('"+desc+"','"+name+"')",function(err,result){
                    if(err){
                           ("error:"+err);
                        result.send("error");
                    }
                    else{
                           ("new role added in the database");
                        res.send(response(true,"New Role Created successfully",null));
                    }
                });
            }
            else{
                   ("Role already created.");
                res.send(response(true,"Role already created.",null));
            }
        }
    });
})
.get("/timetable",checkSignIn,function(req,res){
    connection.query("SELECT  day, p1, p2, p3, p4, p5, p6, p7, p8 FROM clmsdb.time_table where course='BE' and year ='2' and sem='3' and department_name ='BME'",function(err,data){
        if(err) throw err;
        else {
            //    (data);
            res.send(response(true,"true",data));}
    })
  
})
.post("/deletearchive",checkSignIn,function(req,res){
    var body=req.body;
    connection.query("DELETE FROM `clmsdb`.`time_table` WHERE (`combid` = ?  and active =0)",[body.id],function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,"sucess",null));
        }
    })
})
.post("/deleteshedule" , checkSignIn,function(req,res){
    var body=req.body;
    connection.query("SELECT class_id FROM clmsdb.lecturer_details where active=1 and allotid in (SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where sub_id in (SELECT sub_id FROM clmsdb.subject_info where subinfo=?) union SELECT labfacallt FROM clmsdb.lab_faculty_allotment where subcode in (SELECT sub_id FROM clmsdb.subject_info where subinfo=?))",[body.id,body.id],function(err,data){
        if(err) throw err;
        else{
            console.log(data,"heiii")
            data.forEach(element => {
                connection.query("DELETE FROM `clmsdb`.`lecturer_details` WHERE (`class_id` = ?)",[element.class_id],function(err,data1){
                    if(err) throw err;
                    else{

                    }
                })
            });    
        }
    })
    connection.query("SELECT sno FROM clmsdb.time_table where combid=? and active=1",[body.id],function(err,data){
        if(err) throw err;
        else{
            data.forEach(element=>{
                connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '0' WHERE (`sno` = ?)",[element.sno],function(err,data){
                    if(err) throw err;
                    else{

                    }
                })
            });
            res.send(response(true,"sucess",null))
            
        }
    });
})
.post("/addrooms",checkSignIn,function(req,res){
    console.log(req.body);
    connection.query("INSERT INTO `clmsdb`.`building_room` (`building_name`, `room_no`) VALUES (?,?)",[req.body.dept,req.body.room],function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,"sucess",null));
        }
    })    
    // res.send(response(true,"sucess",null));
})
.post("/deleteroom",checkSignIn,function(req,res){
    // console.log(req.body);
    connection.query("DELETE FROM `clmsdb`.`building_room` WHERE (`idnew_table` = ?)",[req.body.id],function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,"sucess",null));
        }
    })
})
.post("/getrooms",checkSignIn,function(req,res){
    connection.query("SELECT * FROM clmsdb.building_room",function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,"sucesss",data));
        }
    })
})
.post("/addDepartment",checkSignIn,function(req,res){
    var body=req.body;
    console.log(body)
    connection.query("SELECT * FROM clmsdb.departments_course where department=?",[body.deptname],function(err,data){
        if(err) throw err;
        else{
            if(data.length==0){
                connection.query("INSERT INTO `clmsdb`.`buildings` (`name`) VALUES (?)",[body.deptname],function(err,data){
                    if(err) throw err;
                    else{
                        let dept="Dept of "
                        let name=dept.concat(body.deptname);
                        connection.query("INSERT INTO `clmsdb`.`faculty_info` (`name`, `abbr`, `department`,`active`) VALUES (?,?,?,?)",[name,name,body.deptname,1],function(err,dat){
                            if(err) throw err;
                            else{

                            }
                        })
                        body.deptcourse.forEach((element,index) => {
                            body.deptsemesterfor[index].forEach(element2=>{
                                connection.query("INSERT INTO `clmsdb`.`departments_course` (`course`, `specilization`, `semester`, `department`) VALUES (?,?,?,?)",[element.label,body.deptSpecialization,element2.id,body.deptname],function(err,data3){
                                    if(err) throw err;
                                    else{

                                    }
                                })
                            })
                        });
                    }
                })
                var check={
                    check:false
                };
                res.send(response(true,"sucess",check));
            }else{
                
                var check={
                    check:true
                };
                res.send(response(true,"sucess",check));
            }
        }
    })

})
.post("/addsemesters",checkSignIn,function(req,res){
    var body=req.body;
    connection.query("select *from clmsdb.departments_course where course=? and specilization=? and department=?",[body.course,body.speci,body.deptname],function(err,dat1){
        if(err) throw err;
        else{
            if(dat1.length>0){
                var check=false;
                res.send(response(true,"sucess",check));
            }
            else{
                body.semesters.forEach(element=>{
        connection.query("INSERT INTO `clmsdb`.`departments_course` (`course`, `specilization`, `semester`, `department`) VALUES (?,?,?,?)",[body.course,body.speci,element.id,body.deptname],function(err,data){
            if(err) throw err;
            else{

            }
        })
    });     
           
            }
        }
    })
    
})
.post("/activaterole",checkSignIn,function(req,res){
    var body=req.body;
    if(body.data=="Active"){
        connection.query("UPDATE `clmsdb`.`task_type` SET `core_task` = '0' WHERE (`tasktype_id` = 'TT11186')",function(err,data){
            if(err) throw err;
            else{
                res.send(response(true,"sucess",null));
            }
        })
    }else if(body.data=="Deactive"){
        connection.query("UPDATE `clmsdb`.`task_type` SET `core_task` = '1' WHERE (`tasktype_id` = 'TT11186')",function(err,data){
            if(err) throw err;
            else{
                res.send(response(true,"sucess",null));
            }
        })
    }
    // res.send(response(true,"sucess",null));
    // connection.query("UPDATE `clmsdb`.`task_type` SET `core_task` = '0' WHERE (`tasktype_id` = 'TT11186');    ")
})
.post("/getarchives",checkSignIn,function(req,res){
    connection.query("SELECT distinct id, course, specilization, semester, department FROM clmsdb.time_table,clmsdb.departments_course where time_table.active=0 and departments_course.id=time_table.combid",function(err,data1){
        if(err) throw err;
        else{
            connection.query("SELECT * FROM clmsdb.departments_course where id in (SELECT subinfo FROM clmsdb.subject_info where sub_id in (SELECT subcode FROM clmsdb.lecturer_details,lab_faculty_allotment where lecturer_details.active=1 and  lab_faculty_allotment.labfacallt=lecturer_details.allotid union SELECT sub_id FROM clmsdb.lecturer_details,theory_fac_allotment where lecturer_details.active=1 and   theory_fac_allotment.theoryfacallt=lecturer_details.allotid))",function(err,data2){
                if(err) throw err;
                else{
                    var finalData={
                        archives:data1,
                        sheduledata:data2

                    }
                    res.send(response(true,"sucess",finalData))
                }
            })
        }
    })
})
.post("/deactivate",checkSignIn,function(req,res){
    connection.query("SELECT core_task FROM clmsdb.task_type where tasktype_id=?",["TT11186"],function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,"sucess",data))
        }
    })
})
.post("/Changepassword",checkSignIn,function(req,res){
    var body=req.body;
    connection.query("SELECT * FROM clmsdb.users where password=md5(?) and user_id=?",[body.oldpass,body.userid],function(err,data1){
        if(err) throw err;
        else{
            if(data1.length==0){
                console.log(data1.length)
                var send={
                    check:false,
                }
                res.send(response(true,"sucess",send))
            }else{
                connection.query("UPDATE `clmsdb`.`users` SET `password` = md5(?) WHERE (`user_id` = ?)",[body.newpass,body.userid],function(err,data){
                    if(err) throw err;
                    else{
                        var send={
                            check:true,
                        }
                        res.send(response(true,"sucess",send))
            
                    }
                }) 
            }
        }
    })
    
})




// .post("/home/createTask",function(req,res){
//     var obj =req.body;
//     var taskName=obj.taskName;
//     var taskDuration=obj.taskDuration;
//     var userData=req.session.data;
//     var roleid=userData.roleid;

//     //creation of new task by the user and then inserting in database.
//     connection.query("select * from task_type where description =?",[taskName],function(err,data){
//         if(err){
//                (err);
//             res.send(response(false,"Error creating task.",null));
//         }else{
//             if(data.length==1){
//                 var form =data[0].formId;
//                 var queryStr="insert into tasks(taskname,roleid,formtypeid,timeofCompletion) values('"+taskName+"','"+roleid+"','"+form+"',STR_TO_DATE('"+taskDuration+"', '%Y-%m-%d'));";
//                 queryStr+="select * from tasks ORDER BY id DESC LIMIT 1;";
//                 connection.query(queryStr,[1,2],function(err,result){
//                     if(err){
//                            (err);
//                         res.send(response(false,"Error creating task.",null));
//                     }
//                     else
//                     res.send(response(true,"Task created successfully.",result[1]));
//                 });
//             }
//         } 
//     });    
// })

.get("/home/logout",function(req,res){
    //ending the session at the time of logout.
    console.log(req.session);
    if(req.session){
        var userData=req.session.data;
        req.session.loggedIn=false;
        req.session.destroy(function(err){
            if(err){
                   console.log(err);
            }
            else {
                var timeout=timestamp('YYYY-MM-DD HH:mm:ss');
                   ("session_destroyed");
                // var user_id=userData.user_id;
                //   (user_id);
                // connection.query("update usersession set timeout='"+timestamp('YYYY-MM-DD HH:mm:ss')+"' where userId='"+user_id+"'");
                res.send(response(true,"success"));
            }
        });
    }
})
.get("/facavb",checkSignIn,function(req,res){
    var code = req.query.code;
    var day=req.query.day;
    var frm;
    var to;
    if(req.query.from>4){
        frm=parseInt(req.query.from)+1;
        to = parseInt(req.query.to)+1;
    }else{
        frm=parseInt(req.query.from);
        to=parseInt(req.query.to);
    }
    console.log(code,frm,to,day);
    // connection.query("call clmsdb.getfac(?,?, ?, ?)",[day,code,to,frm],function(err,data){
    //     if(err){
    //      throw err;
    //     }
    //     else 
    //     {
    //         console.log(data);
    //         res.send(response(true,'sucess',data));

    //     }
    // });
    connection.query("SELECT id FROM clmsdb.faculty_info where name in (SELECT concat('Dept of ',name) as facid FROM clmsdb.buildings)",function(err,data){
        if(err) throw err;
        else{
            let ids=data.map((item)=>item.id);
            connection.query("SELECT labfacallt FROM clmsdb.lab_faculty_allotment where faccode1 in (?) and faccode2 in (?) and faccode3 in (?) and faccode4 in (?) union SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where facid in (?)",[ids,ids,ids,ids,ids],function(err,data1){
                if(err) throw err;
                else{
                    connection.query("SELECT sub_id FROM clmsdb.subject_info where subinfo=?",[req.query.code],function(err,data2){
                        if(err) throw err;
                        else{
                            let alot=data1.map((item)=>item.labfacallt);
                            let sub=data2.map((item)=>item.sub_id);
                            connection.query("SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where  sub_id  in (?) or theoryfacallt  in (?) union SELECT labfacallt FROM clmsdb.lab_faculty_allotment where subcode  in (?) or labfacallt  in (?)",[sub,alot,sub,alot],function(err,data3){
                                if(err) throw err;
                                else{
                                    let red=data3.map((item)=>item.theoryfacallt);
                                    console.log(red,req.query.day,to,frm)
                                    connection.query("SELECT allotid FROM clmsdb.lecturer_details where day=? and d_from<=? and d_to>=? and active>0",[req.query.day,to,frm],function(err,data4){
                                        if(err) throw err;
                                        else{
                                            console.log(data4, "helloghg")
                                            let occ=data4.map((item)=>item.allotid);
                                            let crt=occ.filter(x=>!red.includes(x));
                                            console.log(crt)
                                            if(data4.length>0 && crt.length>0){
                                                let unused=data4.map((item)=>item.allotid);
                                                connection.query("select  faccode1 FROM clmsdb.lab_faculty_allotment where labfacallt in (?) union SELECT faccode2 FROM clmsdb.lab_faculty_allotment where labfacallt in (?) union SELECT faccode3 FROM clmsdb.lab_faculty_allotment where labfacallt in (?) union  SELECT faccode4 FROM clmsdb.lab_faculty_allotment where labfacallt in (?)  union SELECT facid FROM clmsdb.theory_fac_allotment where theoryfacallt in (?)",[crt,crt,crt,crt,crt],function(err,data5){
                                                    if(err) throw err;
                                                    else{
                                                        console.log(crt,data5)
                                                        let facid=data5.map((item)=>item.faccode1);
                                                        facid=facid.filter(item=>item!==undefined && item!==' ' && item!=='' && item!==null);
                                                        if(facid.length>0){
                                                            connection.query("SELECT labfacallt FROM clmsdb.lab_faculty_allotment where faccode1 not in (?) and faccode2 not in (?) and faccode3 not in (?) and faccode4 not in (?) and subcode in (?) union SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where facid not in (?) and sub_id in (?)",[facid,facid,facid,facid,sub,facid,sub],function(err,data6){
                                                                if(err) throw err;
                                                                else{
                                                                    console.log(data6)
                                                                    res.send(response(true,"sucess",data6));
                                                                }
                                                            })
                                                        }else{
                                                            connection.query("SELECT labfacallt FROM clmsdb.lab_faculty_allotment where  subcode in (?) union SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where sub_id in (?)",[sub,sub],function(err,data7){
                                                                if(err) throw err;
                                                                else{
                                                                    console.log(data7)
                                                                    res.send(response(true,"sucess",data7));
                                                                }
                                                            })
                                                        }
                                                        
                                                    }
                                                })
                                            }else{
                                                connection.query("SELECT labfacallt FROM clmsdb.lab_faculty_allotment where  subcode in (?) union SELECT theoryfacallt FROM clmsdb.theory_fac_allotment where sub_id in (?)",[sub,sub],function(err,data7){
                                                    if(err) throw err;
                                                    else{
                                                        console.log(data7)
                                                        res.send(response(true,"sucess",data7));
                                                    }
                                                })
                                            }
                                            
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            // res.send(response(true,"sucess",null));
        }
    })
})
.post('/clearFacSubAllot',checkSignIn,function(req,res){
    var body=req.body;
    connection.query("DELETE FROM `clmsdb`.`lab_faculty_allotment` WHERE subcode in (SELECT sub_id FROM clmsdb.subject_info where subinfo =?)",[body.sem],function(err,data){
        if(err) throw err;
        else{
            connection.query("DELETE FROM clmsdb.theory_fac_allotment WHERE sub_id in (SELECT sub_id FROM clmsdb.subject_info where subinfo =?)",[body.sem],function(err,data){
                if(err) throw err;
                else{
                    console.log("done with deletion");
                    res.send(response(true,"sucess",null));
                }
            })
                    // res.send(response(true,"sucess",null));
            
        }
    });

})
.post('/getelementAPI',checkSignIn,function(req,res){
    var body=req.body;
    var str=[];
    body.code.forEach((element,index)=>{
        // count++;
        connection.query("call clmsdb.gettheory(?,?,?,?,?)",[element,body.frm,body.to,body.day,body.code2],function(err,data){
            if(err) throw err;
            else{
                if(data[0].length>0){
                    console.log(data[0].name,"theory");
                    str.push(data[0][0].name);
                    if(str.length==body.code.length){
                        var data=str.join(" & ");
                        res.send(response(true,"sucess",data));
                    }
                }else{
                    console.log(element,body.frm,body.to,body.day,body.code2);
                    connection.query("call clmsdb.getlab(?, ?, ?,?, ?)",[element,body.frm,body.to,body.day,body.code2],function(err,data1){
                        if(err) throw err;
                        else{
                            if(data1.length==0){
                                var data=false;
                                res.send(response(true,"sucess",data));
                            }else{
                                str.push(data1[0][0].name);
                            console.log(str,"bye");
                            if(str.length==body.code.length){
                                var data=str.join(" & ");
                                res.send(response(true,"sucess",data));
                            }
                            }
                            
                        }
                    })
                }
            }
        })
    });
})
.post('/deactivateuser',checkSignIn,function(req,res){
    var body=req.body;
    console.log(body)
    if(body.valid==1){
        console.log(body);
        connection.query("UPDATE `clmsdb`.`users` SET `valid` = '0' WHERE (`user_id` = ?)",[body.user_id],function(err,data){
            if(err) throw err;
            else{
                res.send(response(true,"sucess",null));
            }
        })
    }else if(body.valid==0){
        console.log(body);
        connection.query("UPDATE `clmsdb`.`users` SET `valid` = '1' WHERE (`user_id` = ?)",[body.user_id],function(err,data){
            if(err) throw err;
            else{
                res.send(response(true,"sucess",null));
            }
        })
    }
     
})
.post('/deleteuser',checkSignIn,function(req,res){
    var body=req.body;
    connection.query("DELETE FROM `clmsdb`.`user_role_mapping` WHERE (`userid` = ?)",[body.user_id],function(err,data){
        if(err) throw err;
        else{
            connection.query("DELETE FROM `clmsdb`.`users` WHERE (`user_id` = ?)",[body.user_id],function(err,data1){
                if(err) throw err;
                else{
                    connection.query("DELETE FROM `clmsdb`.`persons` WHERE (`codeno` = ?)",[body.user_id],function(err,data2){
                        if(err) throw err;
                        else{
                            res.send(response(true,"sucess",null));
                        }
                    })
                }
            })
        }
    })
})
.post('/undoAPI',checkSignIn,function(req,res){
    var body= req.body;
    connection.query("DELETE FROM `clmsdb`.`lecturer_details` WHERE (`day` = ? and d_from=? and d_to=? and active=2 and allotid=?)",[body.day,body.frm,body.to,body.code],function(err,data){
        if(err) throw err;
        else{
            console.log("hiii");
            res.send(response(true,"sucess",true));
        }
    })
})
.post('/updatefacAPI',checkSignIn,function(req,res){
    var body=req.body;
    console.log(body);
    // connection.query("call clmsdb.checkfac(?,?, ?, ?)",[body.day,body.code,body.to,body.from],function(err,data){
    //     if(err) throw err;
    //     else{
            // if(data.length>0){
                connection.query("INSERT INTO `clmsdb`.`lecturer_details` (`day`, `d_from`,`d_to`, `room_no`, `buildingroom_name`, `active`, `allotid`) VALUES (?,?,?,?,?,2,?)",[body.day,body.from,body.to,body.room,body.building,body.code],function(err,data){
                    if(err) throw err;
                    else{
                        var flag=true;
                        res.send(response(true,"sucess",flag));
                    }
                })
            // }else{
            //     var flag=false;
            //     res.send(response(true,"sucess",flag));

            // }
    //     }
    // })
    // res.send(response(true,"sucess",null));call clmsdb.checkfac('Monday','THEOFAC000140', 3, 1);

})
.post('/allotwithprevious',checkSignIn,function(req,res){
    var body=req.body;
    console.log(body);
    connection.query("SELECT theoryfacallt,sub_name,faculty_info.name FROM clmsdb.theory_fac_allotment,clmsdb.subject_info, clmsdb.faculty_info  where subject_info.subinfo=? and theory_fac_allotment.sub_id= subject_info.sub_id and faculty_info.id=theory_fac_allotment.facid",[body.sem],function(err,data){
        if(err) throw err;
        else{
            connection.query("  SELECT lab_faculty_allotment.labfacallt,subject_info.sub_name,lab_faculty_allotment.batch,faculty_info.name AS faculty FROM `faculty_info`JOIN `lab_faculty_allotment` JOIN `subject_info` WHERE  ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode1`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[body.sem],function(err,data1){
                if(err) throw err;
                else{
                    connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode2`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[body.sem],function(err,data2){
                        if(err) throw err;
                        else{
                            connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode3`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[body.sem],function(err,data3){
                                if(err) throw err;
                                else{
                                    connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode4`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[body.sem],function(err,data4){
                                        if(err) throw err;
                                        else{
                                            connection.query("SELECT distinct building_name FROM clmsdb.building_room",function(err,data5){
                                                if(err) throw err;
                                                else{
                                                    connection.query("SELECT  building_name,room_no FROM clmsdb.building_room",function(err,data6){
                                                        if(err) throw err;
                                                        else{
                                                            var finalData={
                                                                lab:data1,data2,data3,data4,
                                                                theory:data,
                                                                buildings:data5,
                                                                rooms:data6
                                                            }
                                                            console.log(finalData);
                                                            res.send(response(true,"sucess",finalData));
                                                        }
                                                    })
                                                    
                                                }
                                            })
                                            
                                        }
                                    })
                                }
                            })
                        }
                    }) 
                }
            })
        }
    });
})
.post('/facallotment',checkSignIn,function(req,res){
    var body=req.body;
    console.log(body.subinfo.faculty);
    // res.send(response(true,'sucess',null));
    if(body.subinfo.type=='Lab'){
        if(body.subinfo.faculty.length==1){
            connection.query("INSERT INTO `clmsdb`.`lab_faculty_allotment` (subcode, faccode1, batch) VALUES (?, ?, ?)",[body.subinfo.subjectid,body.subinfo.faculty[0].facid,body.subinfo.batch],function(err,data){
                if(err){
                    throw err;
                }
                else{
                    // console.log(data)
                    res.send(response(true,'sucess',null));
                }
            })
        }
        if(body.subinfo.faculty.length==2){
            connection.query("INSERT INTO `clmsdb`.`lab_faculty_allotment` (subcode, faccode1,faccode2, batch) VALUES (?, ?,?, ?)",[body.subinfo.subjectid,body.subinfo.faculty[0].facid,body.subinfo.faculty[1].facid,body.subinfo.batch],function(err,data){
                if(err){
                    throw err;
                }
                else{
                    // console.log(data)
                    res.send(response(true,'sucess',null));
                }
            })
        }
        if(body.subinfo.faculty.length==3){
            connection.query("INSERT INTO `clmsdb`.`lab_faculty_allotment` (subcode, faccode1,faccode2,faccode3, batch) VALUES (?, ?, ?,?,?)",[body.subinfo.subjectid,body.subinfo.faculty[0].facid,body.subinfo.faculty[1].facid,body.subinfo.faculty[2].facid,body.subinfo.batch],function(err,data){
                if(err){
                    throw err;
                }
                else{
                    // console.log(data)
                    res.send(response(true,'sucess',null));
                }
            })
        }
        if(body.subinfo.faculty.length==4){
            connection.query("INSERT INTO `clmsdb`.`lab_faculty_allotment` (subcode, faccode1,faccode2,faccode3,faccode4, batch) VALUES (?, ?, ?,?,?,?)",[body.subinfo.subjectid,body.subinfo.faculty[0].facid,body.subinfo.faculty[1].facid,body.subinfo.faculty[2].facid,body.subinfo.faculty[3].facid,body.subinfo.batch],function(err,data){
                if(err){
                    throw err;
                }
                else{
                    // console.log(data)
                    res.send(response(true,'sucess',null));
                }
            })
        }
    }
    if(body.subinfo.type=='Theory'){
        console.log(body.subinfo);
        connection.query("INSERT INTO `clmsdb`.`theory_fac_allotment` (sub_id, facid) VALUES (?, ?)",[body.subinfo.subjectid,body.subinfo.faculty[0].facid],function(err,data){
            if(err) throw err;
            else{
                console.log("done",data);
                res.send(response(true,'sucess',null));
            }
        })
    }
      
    })
// .post('/facallotment',checkSignIn,function(req,res){
// //   console.log(req.body); 
//     var body=req.body;
//   if(body.subinfo.type=='Lab'){
//       console.log("lab")
//       connection.query("SELECT facsubid FROM clmsdb.faculty_subject_info  where subject_name = ? and batch=? and department=? and course=? and speclisation=? and sem=?",[body.subinfo.subject,body.subinfo.batch,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data1){
//         if(err) throw err;
//         else{
//             if(data1.length==0){
//                 // connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0].facsubid],function(err,data){
//                 //     if(err) throw err;
//                 //     else{
//                         connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (subject_name, faculty_name, batch, department, course, speclisation, sem) VALUES (?, ?, ?, ?, ?, ?, ?)",[body.subinfo.subject,body.subinfo.faculty,body.subinfo.batch,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                             if(err) {throw err;
                            
//                             }
//                             else{
//                                 console.log(data)
//                                 res.send(response(true,'sucess',null));
//                             }
//                         })
//                 //     }
//                 // })
//             }
//             if(data1.length>0){
//                     connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0].facsubid],function(err,data){
//                     if(err) throw err;
//                     else{
//                     connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (subject_name, faculty_name, batch, department, course, speclisation, sem) VALUES (?, ?, ?, ?, ?, ?, ?)",[body.subinfo.subject,body.subinfo.faculty,body.subinfo.batch,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                         if(err) {throw err;
                        
//                         }
//                         else{
//                             console.log(data)
//                             res.send(response(true,'sucess',null));
//                         }
//                     })
//                 }
//             })
//             }
            
//         }
            
//       })
       
//   }
//   if(body.subinfo.type=='Theory'){
//       if(body.subinfo.faculty){
//         connection.query("SELECT facsubid FROM clmsdb.faculty_subject_info  where subject_name = ?  and department=? and course=? and speclisation=? and sem=?",[body.subinfo.subject,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data1){
//             if(err) throw err;
//             else{
//                 if(data1.length==0){
//                     // connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0]],function(err,data){
//                     //     if(err) throw err;
//                     //     else{
//                             connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (`subject_name`, `faculty_name`, `department`, `course`, `speclisation`, `sem`) VALUES (?, ?, ?, ?, ?, ?)",[body.subinfo.subject,body.subinfo.faculty,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                                 if(err) throw err;
//                                 else{
//                                     res.send(response(true,'sucess',null));
//                                 }
//                             })
//                     //     }
//                     // })
//                 }
//                 if(data1.length>0){
//                     connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0].facsubid],function(err,data){
//                         if(err) throw err;
//                         else{
//                         connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (`subject_name`, `faculty_name`, `department`, `course`, `speclisation`, `sem`) VALUES (?, ?, ?, ?, ?, ?)",[body.subinfo.subject,body.subinfo.faculty,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                             if(err) throw err;
//                             else{
//                                 res.send(response(true,'sucess',null));
//                             }
//                         })
//                     }
//                 })
//                 }
      
//         }
//         })
//       }else if(!body.subinfo.faculty){
//         connection.query("SELECT facsubid FROM clmsdb.faculty_subject_info  where subject_name = ?  and department=? and course=? and speclisation=? and sem=?",[body.subinfo.subject,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data1){
//             if(err) throw err;
//             else{
//                 if(data1.length==0){
//                     // connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0]],function(err,data){
//                     //     if(err) throw err;
//                     //     else{
//                             connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (`subject_name`, `department`, `course`, `speclisation`, `sem`) VALUES (?, ?, ?, ?, ?)",[body.subinfo.subject,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                                 if(err) throw err;
//                                 else{
//                                     res.send(response(true,'sucess',null));
//                                 }
//                             })
//                     //     }
//                     // })
//                 }
//                 if(data1.length>0){
//                     connection.query("DELETE FROM `clmsdb`.`faculty_subject_info` WHERE (facsubid=?)",[data1[0].facsubid],function(err,data){
//                         if(err) throw err;
//                         else{
//                         connection.query("INSERT INTO `clmsdb`.`faculty_subject_info` (`subject_name`, `faculty_name`, `department`, `course`, `speclisation`, `sem`) VALUES (?, ?, ?, ?, ?, ?)",[body.subinfo.subject,body.subinfo.faculty,body.deptdetails.dept,body.deptdetails.grad,body.deptdetails.spelization,body.deptdetails.sem],function(err,data){
//                             if(err) throw err;
//                             else{
//                                 res.send(response(true,'sucess',null));
//                             }
//                         })
//                     }
//                 })
//                 }
      
//         }
//         })
//       }
    
//   }
  
// })
.get("/facdayinfo",checkSignIn,function(req,res){
    var info=req.query;
    // console.log(info.name,info.day);
    connection.query("SELECT teacher_name,day,d_from,d_to,department FROM clmsdb.lecturer_details,faculty_info where teacher_name=? and day=? and name=teacher_name",[info.name,info.day],function(err,data){
        if(err) throw err;
        else{
            // console.log(data);
            res.send(response(true,"sucess",data));
        }
    })

})

.post("/deletespec",checkSignIn,function(req,res){
    console.log(req.body);
    connection.query("delete from clmsdb.departments_course where course=? and specilization=? and department=?", [req.body.Course, req.body.specilization, req.body.dept],function(err,data){
        if(err) throw err;
        else
        {
            connection.query("select * from clmsdb.departments_course where department=?",[req.body.dept],function(err,data1){
                if(err) throw err;
                else{
                    if(data1.length>0){
                        res.send(response(true,"success",null));
                    }else if (data1.length==0) {
                        connection.query("DELETE from clmsdb.buildings where name=?",[req.body.dept],function(err,data2){
                            if(err) throw err;
                            else{
                        res.send(response(true,"success",null));

                            }
                        })
                    }
                }
            })
        }
    })
    
})


.get("/subinfo",checkSignIn,function(req,res){
    var qe=req.query;
    // console.log(qe)
    connection.query("SELECT * FROM clmsdb.subject_info where subinfo =?  and active=1",[qe.sem],function(err,data){
        if(err) throw err;
        else{
            // connection.query("SELECT * FROM clmsdb.subject_info where department=? and course =?  and specilization=? and sem=? and type='Lab' order by sub_name",[qe.dept,qe.grad,qe.spelization,qe.sem],function(err,data1){
            //     if(err) throw err;
            //     else{
                    // query should be changed after department table
                    connection.query("SELECT distinct department FROM clmsdb.faculty_info",function(err,data2){
                        if(err) throw err;
                        else{
                            connection.query("SELECT distinct name,department,id FROM clmsdb.faculty_info where active=1",function(err,data3){
                                if(err) throw err;
                                else{
                                    connection.query("SELECT  day FROM clmsdb.working_days order by id",function(err,data4){
                                        if(err) throw err;
                                        else{
                                            // connection.query("SELECT name,day,d_from,d_to,department FROM clmsdb.lecturer_details,faculty_info where   name=teacher_name",function(err,data5){
                                            //     if(err) throw err;
                                            //     else{
                                                      var info={
                                                        subjects:data,
                                                        // Lab:data1,
                                                        department:data2,
                                                        facinfo:data3,
                                                        days:data4
                                                        }
                                                        res.send(response(true,"true",info));
                                            //     }
                                            // })
                                          

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            // })
        // }
    })
  
})

.get("/home",checkSignIn,function(req,res){
    
       (req.query.userId);
 

    //var data1,data2;
    //var flag1=1; flag2=1;

    //retrieving all the tasks initiated by the user.
    connection.query("select statename from tasks join task_type on tasks.tasktype_id = task_type.tasktype_id where user_id = ?",[req.query.userId],function(err,data1){
            
        if(err) throw err; 
        
         connection.query("select statename from tasks join task_type on tasks.tasktype_id = task_type.tasktype_id where next_user_id = ?",[req.query.userId],function(err,data2){
            if(err) throw err;
            
            var finaldata = { mytask : data1, yourtask : data2 };

           //    (finaldata.mytask[0]);
            
            res.send(response(true,"true",finaldata));          

        });       
    });

     
    
    
})
// .post("/createuser",function(req,res){

//    // var name=req.body.Name;
//     var password=req.body.Password;
//     var codeno=req.body.CodeNo;
//     var role=req.body.Role.name;
//     var roleid="";
//     var userid="";

//     //    (name);
//        (password);
//        (codeno);
//         (role);
  
//     var dupcheck = "SELECT * from users WHERE emp_codeno = '" + codeno + "'";

//     var insertuser = "INSERT INTO users(password,dofcreation,valid,emp_codeno) VALUES(MD5('" + password + "'),CURDATE(),1,'" + codeno + "')";
    
//     var getroleid  = "SELECT id from processrole where name='" + role + "'";
//     var getuserid  = "SELECT user_id from users WHERE emp_codeno= '" + codeno + "'";
    
    

//     connection.query(dupcheck, function (err,result1) {
//         if (err) throw err;
         
//         if(result1.length==0){
            
//              connection.query(insertuser, function (err, result) {
//                  if (err) throw err;
//                     ("record inserted");
           
//             });

//              connection.query(getuserid, function (err, result2) {
//                  if (err) throw err;
//                  userid=result2[0].user_id
//                     ("gotid");
           
//             }); 


//             connection.query(getroleid,function(err,result3){
//             if(err) throw err;
//                 roleid=result3[0].id;
//                    (roleid);
//                 var insertrole = "INSERT INTO user_role_mapping VALUES('" + userid + "','" + roleid + "')";
//                 connection.query(insertrole,function(err,result){
//                 if(err) throw err;
//                    ('role inserted and mapped');
//             });

//             });




           
           
//             res.send(response(true,"User Created Succesfully"));

//        }else
//             res.send(response(false,"Failure,User already Created"));
//     })

// })
.post("/gettablecourse",function(req,res){
    
    var de=req.body;
    if(de.day){
        connection.query('SELECT  id,dayname(curdate()) as day,course,specilization,semester,department FROM clmsdb.departments_course where id=?',[de.course.id],function(err,datase){
            if(err) throw err;
            else{
                connection.query('SELECT * FROM clmsdb.time_table where   active=1 and combid=? and day=? ',[de.course.id,de.day],function(err,datas){
                    if(err) throw err;
                    else{
                        console.log(de.course.id,de.day)
                        connection.query("SELECT theoryfacallt,sub_name,faculty_info.name FROM clmsdb.theory_fac_allotment,clmsdb.subject_info, clmsdb.faculty_info  where subject_info.subinfo=? and theory_fac_allotment.sub_id= subject_info.sub_id and faculty_info.id=theory_fac_allotment.facid",[de.course.id],function(err,data){
                            if(err) throw err;

                            else{
                                connection.query("  SELECT lab_faculty_allotment.labfacallt,subject_info.sub_name,lab_faculty_allotment.batch,faculty_info.name AS faculty FROM `faculty_info`JOIN `lab_faculty_allotment` JOIN `subject_info` WHERE  ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode1`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data1){
                                    if(err) throw err;
                                    else{
                                        connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode2`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data2){
                                            if(err) throw err;
                                            else{
                                                connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode3`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data3){
                                                    if(err) throw err;
                                                    else{
                                                        connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode4`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data4){
                                                            if(err) throw err;
                                                            else{
                                                                console.log(datas);
        
                                                                var finalData={
                                                                    lab:data1,data2,data3,data4,
                                                                    theory:data,
                                                                    datas:datas,
                                                                    info:datase
                                                                }
                                                                console.log(finalData)
                                                                res.send(response(true,"success",finalData)); 
                       
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }) 
                                        }
                                    })
                                }
                            });
                        }
                    })
            }
        })
        
        }else{
        connection.query("SELECT id,dayname(curdate()) as day, course,specilization,semester,department FROM clmsdb.departments_course where id=?",[de.course.id],function(err,datase){
            if(err) throw err;
            else{
                connection.query('SELECT * FROM clmsdb.time_table where  active=1 and  day=dayname(curdate()) and combid =? ',[de.course.id],function(err,datas){
                    if(err) throw err;
                    else{
                        console.log(de.course.id,de.day)

                        connection.query("SELECT theoryfacallt,sub_name,elective,faculty_info.name FROM clmsdb.theory_fac_allotment,clmsdb.subject_info, clmsdb.faculty_info  where subject_info.subinfo=? and theory_fac_allotment.sub_id= subject_info.sub_id and faculty_info.id=theory_fac_allotment.facid",[de.course.id],function(err,data){
                            if(err) throw err;
                            else{
                                connection.query("  SELECT lab_faculty_allotment.labfacallt,subject_info.sub_name,elective,lab_faculty_allotment.batch,faculty_info.name AS faculty FROM `faculty_info`JOIN `lab_faculty_allotment` JOIN `subject_info` WHERE  ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode1`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data1){
                                    if(err) throw err;
                                    else{
                                        connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode2`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data2){
                                            if(err) throw err;
                                            else{
                                                connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode3`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data3){
                                                    if(err) throw err;
                                                    else{
                                                        connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode4`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.course.id],function(err,data4){
                                                            if(err) throw err;
                                                            else{
                                                                var finalData={
                                                                    lab:data1,data2,data3,data4,
                                                                    theory:data,
                                                                    datas:datas,
                                                                    info:datase
                                                                }
                                                                console.log(finalData)
                                                                res.send(response(true,"success",finalData)); 
                       
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }) 
                                        }
                                    })
                                }
                            });
                          
                        }
                    })
            }
        })    
        
        }

  
    
    
})
.post("/weekreport",function(req,res){
    var de=req.body;
    // console.log(de);
    connection.query("SELECT id,dayname(curdate()) as day, course,specilization,semester,department FROM clmsdb.departments_course where id=?",[de.id],function(err,datase){
        if(err) throw err;
        else{
    connection.query('SELECT time_table.day,time_table.p1,time_table.p2,time_table.p3,time_table.p4,time_table.p6,time_table.p7,time_table.p8,course,specilization,semester FROM clmsdb.time_table,clmsdb.departments_course,clmsdb.working_days where time_table.combid=? and active=1 and departments_course.id=?  and time_table.day=working_days.day order by working_days.id',[de.id,de.id],function(err,datas){
                if(err) throw err;
                else{
                    connection.query("SELECT theoryfacallt,sub_name,elective,faculty_info.name FROM clmsdb.theory_fac_allotment,clmsdb.subject_info, clmsdb.faculty_info  where subject_info.subinfo=? and theory_fac_allotment.sub_id= subject_info.sub_id and faculty_info.id=theory_fac_allotment.facid",[de.id],function(err,data){
                        if(err) throw err;
                        else{
                            connection.query("  SELECT lab_faculty_allotment.labfacallt,subject_info.sub_name,elective,lab_faculty_allotment.batch,faculty_info.name AS faculty FROM `faculty_info`JOIN `lab_faculty_allotment` JOIN `subject_info` WHERE  ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode1`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.id],function(err,data1){
                                if(err) throw err;
                                else{
                                    connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode2`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.id],function(err,data2){
                                        if(err) throw err;
                                        else{
                                            connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode3`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.id],function(err,data3){
                                                if(err) throw err;
                                                else{
                                                    connection.query("SELECT `faculty_info`.`name` AS `name`,subject_info.sub_name,lab_faculty_allotment.batch FROM ((`faculty_info` JOIN `lab_faculty_allotment`) JOIN `subject_info`) WHERE ((`faculty_info`.`id` = `lab_faculty_allotment`.`faccode4`) AND (`subject_info`.`subinfo` = ?) AND (`lab_faculty_allotment`.`subcode` = `subject_info`.`sub_id`)) ORDER BY `lab_faculty_allotment`.`labfacallt`",[de.id],function(err,data4){
                                                        if(err) throw err;
                                                        else{
                                                            // console.log(datas);
    
                                                            var finalData={
                                                                lab:data1,data2,data3,data4,
                                                                theory:data,
                                                                datas:datas,
                                                                info:datase
                                                            }
                                                            res.send(response(true,"success",finalData)); 
                   
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }) 
                                    }
                                })
                            }
                        });
                    // console.log(data1)
                    // res.send(response(true,"success",data1)); 
                   
                   
                }
            })  
        }
    }); 
})
.post("/getsubjectname",checkSignIn,function(req,res){
    var body=req.body;
    var value;
    if(body.theoryfacallt)
        value=body.theoryfacallt;
    else
        value=body.labfacallt;   
    connection.query("SELECT sub_abbr as subject FROM clmsdb.theory_fac_allotment,clmsdb.subject_info where theoryfacallt=? and subject_info.sub_id=theory_fac_allotment.sub_id",[value],function(err,data){
        if(err) throw err;
        else{
            if(data.length!=0){
                console.log(data)
                res.send(response(true,"sucess",data));
            }else{
                connection.query("SELECT concat(sub_abbr,'-',batch) as subject FROM clmsdb.lab_faculty_allotment,clmsdb.subject_info where labfacallt=? and subject_info.sub_id=lab_faculty_allotment.subcode",[value],function(err,data2){
                    if(err) throw err;
                    else{
                        console.log(data2)
                        res.send(response(true,"sucess",data2));
                    }
                })
            }
        }
    })
})
.post("/test1",checkSignIn,function(req,res){
    console.log("hey idot ")
    connection.query("call clmsdb.deleteing1(?)",[req.body.id],function(err,data){
        if(err) throw err;
        else{
            console.log(data[0]);
            data[0].forEach(element=>{
                connection.query("DELETE FROM `clmsdb`.`lecturer_details` WHERE (`class_id` = ?)",[element.class_id],function(err,data1){
                    if(err) throw err;
                    else{

                    }
                })

            })
            res.send(response(true,'sucess',null));
        }
    })
})
.post("/custom",function(req,res){
    connection.query('SELECT distinct department FROM clmsdb.departments_course',function(err,data){
        if(err) throw err;
        else{
        connection.query('SELECT distinct course FROM clmsdb.departments_course',function(err,data1){
             if(err) throw err;
             else{
                connection.query('SELECT distinct course,specilization,department FROM clmsdb.departments_course',function(err,data2){
                    if(err) throw err;
                    else{
                        connection.query('SELECT distinct id,course,specilization,department,semester FROM clmsdb.departments_course',function(err,data3){
                            if(err) throw err;
                            else{
                                var finaldata={data:data,data1:data1,data2:data2,data3:data3}
                                    // console.log("hurre its worked");
                                 res.send(response(true,"success",finaldata)); 
                                
                            }
                        })
                    }
                })
             }
         })
        }
    })
    
})
.post("/finalinsertAPI",checkSignIn,function(req,res){
    var body=req.body;
    var test=false;
    var test1=false;
    var count =0
    console.log(body);
    for(let i = 0;i<body.length;i++){
        if(body[i]==null){
            test=true;
            res.send(response(true,'sucess',null));
            break;
        }else{
            if(i<8 && body[i]==0){
                count++;
                body[i]=null;
            }
        }
    }
    
    if(!test || count==8){
        if(body[7]=="Monday"){
            // connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '0' WHERE (`combid` = ?)",[body[9]],function(err,data4){
            //     if(err) throw err;
            //     else{
                    connection.query("INSERT INTO `clmsdb`.`time_table` ( `p1`, `p2`, `p3`, `p4`, `p6`, `p7`, `p8`,`day`, `active`, `combid`) VALUES (?,?,?,?,?,?,?,?,?,?)",body,function(err,data){
                        if(err) throw err;
                        else{
                            // connection.query("call clmsdb.deleteing(?)",[body[9]],function(err,data1){
                            //     if(err) throw err;
                            //     else{
                            //         data1[0].forEach(element=>{
                            //             connection.query("UPDATE `clmsdb`.`lecturer_details` SET `active` = '1' WHERE (`class_id` =?)",[element.class_id],function(err,data){
                            //                 if(err) throw err;
                            //                 else{
            
                            //                 }
                            //             })
                            //         })
                            //     }
                            // })
                            // console.log(body);
                             var data={
                                 number:body[10]+1
                             }
                             res.send(response(true,'sucess',data));
            
                    //     }
                    // });
                }
            })
            
        }else{
            connection.query("INSERT INTO `clmsdb`.`time_table` ( `p1`, `p2`, `p3`, `p4`, `p6`, `p7`, `p8`,`day`, `active`, `combid`) VALUES (?,?,?,?,?,?,?,?,?,?)",body,function(err,data){
                if(err) throw err;
                else{
                    // connection.query("call clmsdb.deleteing(?)",[body[9]],function(err,data1){
                    //     if(err) throw err;
                    //     else{
                    //         data1[0].forEach(element=>{
                    //             connection.query("UPDATE `clmsdb`.`lecturer_details` SET `active` = '1' WHERE (`class_id` =?)",[element.class_id],function(err,data){
                    //                 if(err) throw err;
                    //                 else{
    
                    //                 }
                    //             })
                    //         })
                    //     }
                    // })
                    // console.log(body);
                    var data={
                        number:body[10]+1
                    }
                     res.send(response(true,'sucess',data));
    
                }
            });
        }
       
    }
})
.post("/deletedata",checkSignIn,function(req,res){
    var body=req.body;
    console.log(body,"im here");
    connection.query("call clmsdb.deleteing(?)",[body.id],function(err,data1){
        if(err) throw err;
        else{
            data1[0].forEach(element=>{
                connection.query("DELETE FROM `clmsdb`.`lecturer_details` WHERE (`class_id` = ?)",[element.class_id],function(err,data){
                    if(err) throw err;
                    else{

                    }
                })
            });
            connection.query("call clmsdb.deleteing1(?)",[body.id],function(err,data1){
                if(err) throw err;
                else{
                    data1[0].forEach(element=>{
                        connection.query("UPDATE `clmsdb`.`lecturer_details` SET `active` = '1' WHERE (`class_id` =?)",[element.class_id],function(err,data){
                            if(err) throw err;
                            else{
        
                            }
                        })
                    })
                    connection.query("SELECT sno FROM clmsdb.time_table where combid=? and active=1",[body.id],function(err,data){
                        if(err) throw err;
                        else{
                            data.forEach(element=>{
                                connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '0' WHERE (`sno` = ?)",[element.sno],function(err,data){
                                    if(err) throw err;
                                    else{
                
                                    }
                                })
                            });
                            connection.query("SELECT sno FROM clmsdb.time_table where combid=? and active=2",[body.id],function(err,data){
                                if(err) throw err;
                                else{
                                    console.log(data)
                                    data.forEach(element=>{
                                        connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '1' WHERE (`sno` = ?)",[element.sno],function(err,data){
                                            if(err) throw err;
                                            else{
                                                console.log("its good to here")
                                            }
                                        })
                                    })
                        res.send(response(true,"sucess",null));

                                }
                            });

                        }
                    });
                }
            });


        }
    });
    // connection.query("call clmsdb.deleteing1(?)",[body.id],function(err,data1){
    //     if(err) throw err;
    //     else{
    //         data1[0].forEach(element=>{
    //             connection.query("UPDATE `clmsdb`.`lecturer_details` SET `active` = '1' WHERE (`class_id` =?)",[element.class_id],function(err,data){
    //                 if(err) throw err;
    //                 else{

    //                 }
    //             })
    //         })
    //     }
    // })
    // connection.query("SELECT sno FROM clmsdb.time_table where combid=? and active=1",[body.id],function(err,data){
    //     if(err) throw err;
    //     else{
    //         data.forEach(element=>{
    //             connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '0' WHERE (`sno` = ?)",[element.id],function(err,data){
    //                 if(err) throw err;
    //                 else{

    //                 }
    //             })
    //         })
    //     }
    // });
    // connection.query("SELECT sno FROM clmsdb.time_table where combid=? and active=2",[body.id],function(err,data){
    //     if(err) throw err;
    //     else{
    //         data.forEach(element=>{
    //             connection.query("UPDATE `clmsdb`.`time_table` SET `active` = '1' WHERE (`sno` = ?)",[element.id],function(err,data){
    //                 if(err) throw err;
    //                 else{

    //                 }
    //             })
    //         })
    //     }
    // });

})
.post("/bycategory",function(req,res){
    connection.query('SELECT distinct name as  building_name,b.description FROM clmsdb.time_table tt,clmsdb.buildings b ',function(err,data){
        if(err) throw err;
        else{
        res.send(response(true,"success",data)); 

        }
    })
})
.post("/viewfac",checkSignIn,function(req,res){
    var body=req.body;
    console.log(body)
    var finaldata=[];
    for (let index = 0; index <7; index++) {
        connection.query("select dayname(curdate() + interval ? day) as day",[index],function(err,dataa){
            if(dataa[0].day!="Sunday"){
                connection.query("call clmsdb.labshedule(?,?)",[body.id,dataa[0].day],function(err,data){
                    if(err) throw err;
                    else{
                        connection.query("call clmsdb.theoryshedule(?,?)",[body.id,dataa[0].day],function(err,data1){
                            if(err) throw err;
                            else{
                                if(finaldata.length==5){
                                    finaldata.push({day:dataa[0].day,lab:data[0],theory:data1[0]});
                                    console.log(finaldata,"im heere ")
                                    res.send(response(true,"sucess",finaldata));
                                }else{
                                    console.log(finaldata)
                                    finaldata.push({day:dataa[0].day,lab:data[0],theory:data1[0]});
                                }
                                // console.log(finaldata);
                            }
                        })
                    }
                }) 
            }else if(finaldata.length==6){
                res.send(response(true,"sucess",finaldata));
            }
            
        })
               
    }
})
.post("/getfac",checkSignIn,function(req,res){
    connection.query("SELECT * FROM clmsdb.faculty_info order by department",function(err,data){
        if(err) throw err;
        else{
            res.send(response(true,'sucess',data));
        }
    })
})
.post("/addfaculty",checkSignIn,function(req,res){
    var body=req.body;
    console.log(body);
    connection.query('INSERT INTO `clmsdb`.`faculty_info` (`name`, `abbr`, `department`,`active`) VALUES (?,?,?,?)',[body.name,body.abbr,body.dept,2],function(err,data){
        if(err) throw err;
        else{
            connection.query("SELECT id FROM clmsdb.faculty_info where name=? and  abbr=? and active=2 and  department=?",[body.name,body.abbr,body.dept],function(err,data1){
                if(err) throw err;
                else{
                    connection.query("INSERT INTO `clmsdb`.`users` (`user_id`, `password`, `dofcreation`, `valid`) VALUES (?,MD5(?),curdate(),1)",[data1[0].id,"123456",],function(err,data2){
                        if(err) throw err;
                        else{
                            connection.query("INSERT INTO `clmsdb`.`user_role_mapping` (`userid`, `roleid`) VALUES (?, ?)",[data1[0].id,'ROL00001'],function(err,data3){
                                if(err) throw err;
                                else{
                                    // connection.query("insert into usersession(session_id,userId,loginStatus,timein)values('"+ req.sessionID+"','"+ user_id+"',1,'"+timein+"')")
                                    connection.query("SELECT * FROM clmsdb.faculty_info order by department",function(err,data4){
                                        if(err) throw err;
                                        else{
                                            connection.query("UPDATE `clmsdb`.`faculty_info` SET `active` = '1' WHERE (`id` = ?)",[data1[0].id],function(err,data3){
                                                if(err) throw err;
                                                else{
                                                    res.send(response(true,"sucess",data4));

                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
.post("/active",checkSignIn,function(req,res){
    var body=req.body;
    if(body.active>0){
        connection.query("UPDATE `clmsdb`.`faculty_info` SET `active` = '0' WHERE (`id` = ?)",[body.id],function(err,data){
            if(err) throw err;
            else{
                connection.query("UPDATE `clmsdb`.`users` SET `valid` = '0' WHERE (`user_id` = ?)",[body.id],function(err,data1){
                    if(err) throw err;
                    else{
                        res.send(response(true,"sucess",null))
                    }
                })
            }
        })
    }else if(body.active==0){
        connection.query("UPDATE `clmsdb`.`faculty_info` SET `active` = '1' WHERE (`id` = ?)",[body.id],function(err,data){
            if(err) throw err;
            else{
                connection.query("UPDATE `clmsdb`.`users` SET `valid` = '1' WHERE (`user_id` = ?)",[body.id],function(err,data1){
                    if(err) throw err;
                    else{
                        res.send(response(true,"sucess",null))
                    }
                })
            }
        })
    }
})
///
.post("/viewitemAPI",function(req,res){
    console.log(req.body);
    connection.query("SELECT * FROM clmsdb.items where category=?",[req.body.name],function(err,data){
        if(err) throw err;
        else{
            // console.log(data);
            res.send(response(true,"sucess",data));
            
        }
    })
})
.post("/additem",checkSignIn,function(req,res){
    var item =req.body;
    console.log(item);
    connection.query("INSERT INTO `clmsdb`.`items` (`Name`, `Des`, `link`, `quantity`, `price`,`category`) VALUES (?,?,?,?,?,?)",[item.name,item.desc,item.link,item.quant,item.price,item.category],function(err,data){
        if(err)
            throw err;
        else{
            res.send(response(true,"sucess",null));

        }    
    })
})
//
.post("/deletefac",checkSignIn,function(req,res){
    var body=req.body;
    connection.query("DELETE FROM `clmsdb`.`user_role_mapping` WHERE (`userid` = ?)",[body.id],function(err,data){
        if(err) throw err;
        else{
            connection.query("DELETE FROM `clmsdb`.`users` WHERE (`user_id` = ?)",[body.id],function(err,data1){
                if(err) throw err;
                else{
                    connection.query("DELETE FROM `clmsdb`.`faculty_info` WHERE (`id` = ?)",[body.id],function(err,data3){
                        if(err) throw err;
                        else{
                            res.send(response(true,"sucess",null));
                        }
                    })
                }
            })
        }
    })
})
.post("/addsubject",checkSignIn,function(req,res){
    var body=req.body;
    connection.query("DELETE FROM `clmsdb`.`subject_info` WHERE (`subinfo` =?)",[body.id.sem],function(err,data){
        if(err) throw err;
        else{
            body.data.forEach(element => {
                connection.query("INSERT INTO `clmsdb`.`subject_info` (`type`, `sub_name`, `sub_abbr`, `subinfo`,`elective`) VALUES (?,?,?,?,?)",[element.type,element.name,element.abbr,body.id.sem,element.elective],function(err,data){
                    if(err) throw err;
                    else{
        
                    }
                })
            });
            res.send(response(true,"sucess",null));
        }
    })
})
.post("/adduser",checkSignIn,function(req,res){
    connection.query("SELECT * FROM clmsdb.persons , users , user_role_mapping , processrole where  persons.name=? and persons.division=? and users.emp_codeno=persons.codeno and user_role_mapping.userid=users.user_id   and processrole.id=user_role_mapping.roleid and processrole.id=?",[req.body.name,req.body.dept,req.body.rol],function(err,data){
        if(err) throw err;
        else{
            if(data.length>0){
                var data={
                    check:false,
                }
                res.send(response(true,"sucess",data));
            }else if(data.length==0){
                connection.query("INSERT INTO `clmsdb`.`persons` (`name`, `division`,`active`) VALUES (?,?,?)",[req.body.name,"dept",0],function(err,data){
                    if(err) throw err;
                    else{
                        connection.query("SELECT codeno FROM clmsdb.persons where name=? and division=? and active=0",[req.body.name,"dept"],function(err,data1){
                            if(err) throw err;
                             else{
                                connection.query("INSERT INTO `clmsdb`.`users` (`user_id`, `password`, `dofcreation`, `valid`,`emp_codeno`) VALUES (?,MD5(?),curdate(),1,?)",[data1[0].codeno,req.body.password,data1[0].codeno],function(err,data2){
                                    if(err) throw err;
                                    else{
                                        connection.query("INSERT INTO `clmsdb`.`user_role_mapping` (`userid`, `roleid`) VALUES (?, ?)",[data1[0].codeno,req.body.rol],function(err,data3){
                                            if(err) throw err;
                                            else{
                                                connection.query("UPDATE `clmsdb`.`persons` SET `active` = '1' WHERE (`codeno` = ?)",[data1[0].codeno],function(err,data4){
                                                    if(err) throw err;
                                                    else{
                                                        var data={
                                                            check:true,
                                                        }
                                                        res.send(response(true,"sucess",data));
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                             }
                        })
                    }
                })
            }
        }
    })
})
.post("/getusersAPI",checkSignIn,function(req,res){
    connection.query("SELECT user_id,valid,division,name FROM clmsdb.users,clmsdb.persons where persons.codeno=users.emp_codeno",function(err,data){
        if(err) throw err;
        else{
            connection.query("SELECT * FROM clmsdb.processrole where id not in ('ROL00001')",function(err,data1){
                if(err) throw err;
                else{
                    connection.query("SELECT distinct department FROM clmsdb.departments_course",function(err,data2){
                        if(err) throw err;
                        else{
                            var finaldata={
                                data:data,
                                data1:data1,
                                data2:data2,
                            }
                            res.send(response(true,"sucess",finaldata))
                        }
                    })
                }
            })
        }
    })
})
.post("/timetabledeprt",function(req,res){
   
    var obj =req.body;
    connection.query('SELECT distinct course,specilization,id FROM clmsdb.departments_course,clmsdb.time_table where department=? and  active=1 and  id=combid',[obj.building_name],function(err,data){
        if(err) throw err;
        else{
            connection.query('SELECT day FROM clmsdb.working_days order by id',function(err,data3){
                if(err) throw err;
                else{
                    var data2={
                        data:data,
                        data3:data3
                    }
                    res.send(response(true,"success",data2)); 

                }
            })
           
        }
    })
                  
   
})
// .post("/changepassword",function(req,res){
    
//     var obj =req.body;
//     var userid=obj.id;
//     var password=obj.rpass;

//     connection.query('update users set password = MD5(?) where user_id = ?', [password, userid], function(err, data){
//         if(err) throw err;

//         res.send(response(true,"success")); 
           

//         });

      
         






// })
// .post("/verifypass",function(req,res){

//     var obj =req.body;
//     var userid=obj.id;
//     var password=obj.pass;

    
    
//     connection.query('Select * from users where user_id = ? and password = MD5(?)', [userid, password], function(err, data){
//         if(err) throw err;

//         if(data.length==1)
//             res.send(response(true,"checked"));
//         else
//             res.send(response(false,"false"));    
           

//         });
         






// })
// .get("/viewusers",function(req,res){

//     var val = req.query.value;

//     //   (val);

//     if(val == 1 || val == 0){


     
//         connection.query('select * from users join persons on users.emp_codeno = persons.codeno where valid = ?',[val],function(err, data){
//             if(err) throw err;
            
//         //   (data[0]);
//             res.send(response(true,"true",data));

//      });

//     }
//     else{

//         connection.query('select * from users join persons on users.emp_codeno = persons.codeno',function(err, data){
//             if(err) throw err;

//             res.send(response(true,"true",data));

//      });    
//     }





// })
// .put("/updateusers",function(req,res){

//     var val = req.body.valid;
//     var userdata = req.body.userdata;


//     for(var i = 0; i < userdata.length;i++){

//         switch(val){

//             case(1) :

//                 if(userdata[i].selected){

//                     connection.query('update users set valid = 0 where emp_codeno = ?',[userdata[i].emp_codeno],function(err, data){
//                     if(err) throw err;
//                     }); 
//                 }
            
//                 break;

//             case(0) :

//                 if(userdata[i].selected){

//                     connection.query('update users set valid = 1 where emp_codeno = ?',[userdata[i].emp_codeno],function(err, data){
//                     if(err) throw err;
//                     });   

//                 }

//                 break;  

//             case(3) : 

//                 if(userdata[i].selected){  

//                 connection.query('update users set valid = 9 where emp_codeno = ?',[userdata[i].emp_codeno],function(err, data){
//                 if(err) throw err;
//                 });     

//                 }

//                 break;

//         }    
//     }
    
//    res.send(response(true,"true"));
       

          

// })
.post("/getdeptrooms",checkSignIn,function(req,res){
    var body=req.body.id;
    // console.log(body)
    connection.query("SELECT building_name,room_no FROM clmsdb.building_room",function(err,data){
        if(err) throw err;
        else{
            connection.query("SELECT id,name FROM clmsdb.faculty_info",function(err,data1){
                if(err) throw err;
                else{
                    connection.query("call clmsdb.deptwisedetailslabs(?)",[body],function(err,data2){
                        if(err) throw err;
                        else{
                            connection.query("call clmsdb.deptwisedetailstheory(?)",[body],function(err,data3){
                                if(err) throw err;
                                else{
                                    var final={
                                        rooms:data,
                                        fac:data1,
                                        lab:data2,
                                        thoery:data3
                                    }
                                    res.send(response(true,"sucess",final));
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
.get("/home/tasktypedetails",checkSignIn,function(req,res){
    console.log(req.query);
    if(req.query.roleId!=null){
    
        connection.query('select * from task_type join task_type_role_mapping on task_type.tasktype_id = task_type_role_mapping.tasktype_id where role_id = ? and core_task=1 ',[req.query.roleId],function(err, data){
            if(err) throw err;
            
               (data,"hii");
            res.send(response(true,"true",data));

        });


      }
      else
      {

        connection.query('select statename,tasktype_id from task_type where role_id <> ? and role_id <> ?',['ROL00002','ROL00048'],function(err, data){
            if(err) throw err;
            
               (data);
           
            res.send(response(true,"true",data));

     });

      }

    

});



// .get("/home/getuser",function(req,res){

//    var roleid = req.query.role;
//    var state = req.query.state;

//       (roleid);
//       (state);


//        connection.query('Select processrole.minm_design from processrole join task_type on task_type.next_role_id =  processrole.id where task_type.role_id = ? and task_type.statename = ?', [roleid,state], function(err, data1){
//             if(err) throw err;

//             connection.query('select user_id,name,designation,users.emp_codeno from persons,users,employee where users.emp_codeno = persons.codeno and persons.codeno = employee.codeno and employee.designation in (select designation from designation where grade <= ( select grade from designation where designation = ?))', [data1[0].minm_design], function(err, data2){
//                 if(err) throw err
        
//                     res.send(response(true,"true",data2));

//                 });
         

//          });
         

// })

function checkSignIn(req, res,next){
    if(req.session){
    //    console.log(req.session);

       next();     //If session exists, proceed to page
    } else {
        res.send(response(false,"unsucess",null)); //Error, trying to access unauthorized page!
    }
 }
function response(success, message, data) {
    return { success: success, message: message, data: data }
}
module.exports = router;
