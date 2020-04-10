var express = require('express');
var app = express();
var path = require('path');

app.use('/', require('./api'));

app.use(express.static(path.join(__dirname, 'front')));

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/front/" + "index.html");
});
    
app.listen(3000, function() { console.log("Listening to 3000!")});