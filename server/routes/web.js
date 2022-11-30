var express = require('express'),
 router = express.Router(),
 path = require("path");
 
var absPath = path.join(__dirname, "../../app");
// const cors = require('cors');
// router.use(cors()); 
// route to handle home page
router.get('/', function(req, res, next) {
    // console.log("hey welcome")
  res.sendFile(absPath + "/app.html");
});
 
module.exports = router;
