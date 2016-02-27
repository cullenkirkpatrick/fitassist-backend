// BRING IN MODULES
var express  = require('express');
var app      = express();

//ESTABLISH MONGO CONNECTION
var mongoose = require('mongoose');
var testdb = mongoose.createConnection('mongodb://52.90.30.153/test');

var testSchema = mongoose.Schema({
    test: String,
		user: String
});

var userSchema = mongoose.Schema({
		username: String,
		password: String,
		fullname: String
})

var testModel = testdb.model('Test', testSchema, 'Test');

var userModel = testdb.model('Users', userSchema, 'Users');

//=======================================//
//=========SET UP SOME ROUTES============//
//=======================================//
//Test Route
app.get('/uh', function(req, res) {
    res.send('Hello World');
});

app.get('/gettests', function(req, res) {
    // use mongoose to get all todos in the database
    testModel.find({}, function(error, data){
        res.json(data);
    });
});

app.get('/getusers', function(req, res) {
    // use mongoose to get all todos in the database
    userModel.find({}, function(error, data){
        res.json(data);
    });
});

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});
//=======================================//
//=======================================//
//=======================================//


// LISTEN ON PORT
app.listen(3001);
console.log("App listening on port 3001");
