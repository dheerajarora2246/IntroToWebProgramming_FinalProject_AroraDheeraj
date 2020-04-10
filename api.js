var router = require('express').Router();
var bodyParser = require('body-parser');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());

if(fs.existsSync("data.json")){
    console.log("Loading data.json file");
}else{
    console.log("Created new object");  
}    

router.get('/update/:list_of_users/:list_of_properties_workspaces',urlencodedParser, (req,res) => {
    
    var objData = {list_of_properties_workspaces:[],list_of_users:[]};

    objData.list_of_properties_workspaces = JSON.parse(req.params.list_of_properties_workspaces);
    objData.list_of_users = JSON.parse(req.params.list_of_users);
    fs.writeFile("data.json", JSON.stringify(objData),(err) => { 
        if (err) throw err; 
    });

    console.log(objData);
    console.log("data.json successfully updated");

});

module.exports = router;