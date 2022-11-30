var express = require('express'),
 path = require('path'),
 
 bodyParser = require('body-parser'),
 routes = require('./server/routes/web'), //for web routes
 apiRoutes = require('./server/routes/api'); //for api routes
 
   // dbConnection = require("./server/config/dbConnection.js"),
   //  connection = dbConnection.getConnection();




   

//const User = require("./dao/User/User.js");
// creating express server
var app = express();


// var multer  = require('multer');
// var storage = multer.diskStorage({




//     destination: function (req, file, cb) {

//     var dir = './uploads/eic/'+ req.headers.pid;

// 		if (!fs.existsSync(dir)){
//    			 fs.mkdirSync(dir);
// 		}
//         cb(null, './uploads/eic/'+ req.headers.pid)
//     },
//     filename: function (req, file, cb) {
//         cb(null, req.headers.aid+'.pdf')
//     }
// }); 
// var upload = multer({ storage: storage });

// app.post('/uploadfile', upload.single('file'),function(req,res){

//       console.log(req.headers.pid);
//       console.log(req.headers.aid);

//       var path = '/uploads/eic/'+req.headers.pid ;

//       console.log(path);

    
//    connection.query("update attachments_table set path = ? where attach_id = ?",[path,req.headers.aid],function(err,data){
//                    if(err) throw err; 

//      res.send(response(true,"true"));
        
       

     
    
    
// });
  

// });
 
//========= configuration ==========
 
//===== get all the data from the body (POST)

// parse application/json 
app.use(bodyParser.json({limit:'50mb'}));
 
// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));

 
// setting static files location './app' for angular app html and js.
app.use(express.static(path.join(__dirname, 'app')));
// setting static files location './node_modules' for libs like angular, bootstrap.
app.use(express.static('node_modules'));
 
// configure our routes.


app.use('/', routes);
app.use('/api', apiRoutes);
 
// setting port number for running server.
var port = process.env.port || 4000;

 
// starting express server.
app.listen(port, function() {
 console.log("Server is running at : http://localhost:" + port);
});

function response(success, message, data) {
    return { success: success, message: message, data: data }
}