var express = require("express");
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
var server = require('http').createServer(app);
var serveStatic = require('serve-static');


var userRoute = require('./backend/routes/users');
var wishRoute = require('./backend/routes/wish');

var db = mongoose.connection;
var dbconnected = false;
//connection to Database using mongoose.connect(url)
var dbConfig = require('./backend/database/mongoConnectURI');
// mongoose.connect(dbConfig.uri, { useNewUrlParser: true, useUnifiedTopology: true });
// local mongodb
mongoose.connect('mongodb://localhost:27017/wishCard', { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', function(){
    dbconnected = false;
    console.log("Error connecting to Database");
});

db.on('open',function(){	
    dbconnected = true;
    console.log("Database Connected");	
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(serveStatic(__dirname+"/wishCardFrontend/dist"));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use('/', userRoute);
app.use('/', wishRoute);

app.get(/.*/, (req, res) => res.sendFile(__dirname + '/wishCardFrontend/dist/index.html'));

const port = process.env.PORT || 8179;
server.listen(port, () => {
    console.log(`listening at ${port} port!!!!`);
});
