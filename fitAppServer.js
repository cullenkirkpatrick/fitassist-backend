// BRING IN MODULES
var express  = require('express');
var app      = express();

//ESTABLISH MONGO CONNECTION
var mongoose = require('mongoose');
var testdb = mongoose.createConnection('mongodb://54.164.85.164/test');


//==============USER DATA=============//
var userSchema = mongoose.Schema({
		username: String,
		password: String,
		name: {
			first_name: String,
			last_name: String
		}
		email: String,
		user_type: String
});
var userModel = testdb.model('Users', userSchema, 'Users');

//=======================================//
//=========SET UP SOME ROUTES============//
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});
//=======================================//


//============Test Route=================//
app.get('/uh', function(req, res) {
    res.send('Hello World');
});

//============USER ROUTES================//
app.get('/api/getusers', function(req, res) {
    // use mongoose to get all todos in the database
    userModel.find({}, function(error, data){
        res.json(data);
    });
});

//=======================================//
//=======================================//
//=======================================//


// LISTEN ON PORT
app.listen(3001);
console.log("App listening on port 3001");
