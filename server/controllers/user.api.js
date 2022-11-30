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
    console.log(usrid)
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
.post("/bycategory",function(req,res){
    connection.query('SELECT distinct name as  building_name,b.description FROM clmsdb.time_table tt,clmsdb.buildings b ',function(err,data){
        if(err) throw err;
        else{
        res.send(response(true,"success",data)); 

        }
    })
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
                                connection.query("INSERT INTO `clmsdb`.`users` (`user_id`, `password`, `dofcreation`, `valid`,`emp_codeno`) VALUES (?,MD5(?),curdate(),1,?)",[data1[0].codeno,req.body.password,req.body.name],function(err,data2){
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
                                                        console.log("hiiiiiiii")
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
