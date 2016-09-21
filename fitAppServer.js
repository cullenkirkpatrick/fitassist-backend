// BRING IN MODULES
var express  = require('express');

//ESTABLISH MONGO CONNECTION
var mongoose = require('mongoose');
var testdb = mongoose.createConnection('mongodb://54.164.85.164/test');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('auth');

var stripe = require("stripe")("sk_test_8t9VU22taWVz5KPnVF1vYsI7");

var app      = express();

var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
		userModel.findOne({ username: username, password: password }).exec(function(err, user) {
				if (err) {
						console.log('Error loading user: ' + err);
						return;
				}

				else if (user) {
						return done(null, user);
				}
				else {
						return done(null, false);
				}
		})
}));

passport.serializeUser(function(user, done) {
		if (user) {
				return done(null, user._id);
		}
});

passport.deserializeUser(function(id, done) {
		User.findOne({_id: id}).exec(function(err, user) {
				if (err) {
						console.log('Error loading user: ' + err);
						return;
				}

				if (user) {
						return done(null, user);
				}
				else {
						return done(null, false);
				}
		})
});


//==============USER MODEL=============//
var userSchema = mongoose.Schema({
	username: String,
	password: String,
	first_name: String,
	last_name: String,
	gender: String,
	user_type: String,
	stripe_cust: String,
	stripe_subscription: String,
	stripe_plan_id: String,
	stripe_plan_name: String
});
var userModel = testdb.model('Users', userSchema, 'Users');

//==============WORKOUTS MODEL=============//
var workoutsSchema = mongoose.Schema({
	user: {
		id: String,
		first_name: String,
		last_name: String
	},
	workout_date: Date,
	startsAt: Date,
	endsAt: Date,
	exercises: [],
	type: String
});
var workoutsModel = testdb.model('workouts', workoutsSchema, 'workouts');

//==============EXERCISE MODEL=============//
var exercisesSchema = mongoose.Schema({
	name: String,
	muscle_groups: [],
	instructions: String
});
var exercisesModel = testdb.model('exercises', exercisesSchema, 'exercises');

//=======================================//
//=========SET UP SOME ROUTES============//
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Accept-Encoding');
    next();
});
//=======================================//

app.post('/login', function(req, res, next) {
		var auth = passport.authenticate('local', function(err, user) {
				if (err) return next(err);
				if (!user) {
						res.send('Failed Login');
						console.log("FAILURE");
				}

				req.logIn(user, function(err) {
						if (err) return next(err);
						console.log("SUCCESS");
						res.send(user);
				})
		});

		auth(req, res, next);
	}
);

//============Test Route=================//
app.post('/new_fit_individual', function(req, res) {
	stripe.customers.create({
		source: req.body.token, // obtained with Stripe.js
		plan: "fitness_user",
		email: "payinguser@example.com"
	}, function(err, customer) {
		res.send(customer);
	});
});

app.post('/new_nutrition_individual', function(req, res) {
	stripe.customers.create({
		source: req.body.token, // obtained with Stripe.js
		plan: "fitness_nutrition_user",
		email: "payinguser@example.com"
	}, function(err, customer) {
		res.send(customer);
	});
});

app.post('/update_subscripton', function(req, res) {
	stripe.subscriptions.update(
	  req.body.sub_id,
	  { plan: "fitness_nutrition" },
	  function(err, subscription) {
	    res.send(subscription);
	  }
	);
});

app.post('/cancel_subscription', function(req, res) {
	stripe.subscriptions.del(
  req.body.sub_id,
  function(err, customer) {
		res.send(customer);
	});
});

//============USER ROUTES================//
app.get('/users', function(req, res) {
    // use mongoose to get all todos in the database
    userModel.find({}, function(error, data){
        res.json(data);
    });
});

app.post("/users", function(req, res) {
  var newUser = req.body;

  testdb.collection('Users').insertOne(newUser, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc);
    }
  });
});

//============WORKOUTS ROUTES================//
app.get('/workouts', function(req, res) {
    workoutsModel.find({}, function(error, data){
        res.json(data);
    });
});

app.get('/workouts/:id', function(req, res) {
		console.log("ID: " + req.params.id);
    workoutsModel.find({'user.id': req.params.id }, function(error, data){
        res.json(data);
    });
});

app.post("/workouts", function(req, res) {
  var newWorkout = req.body;

  testdb.collection('workouts').insertOne(newWorkout, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new workout.");
    } else {
      res.status(201).json(doc);
    }
  });
});

//============EXERCISE ROUTES================//
app.get('/exercises', function(req, res) {
    exercisesModel.find({}, function(error, data){
        res.json(data);
    });
});

app.post('/exercises', function(req, res) {
  var newExercise = req.body;

  testdb.collection('exercises').insertOne(newExercise, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc);
    }
  });
});


//=======================================//
//=======================================//
//=======================================//


// LISTEN ON PORT
app.listen(3001);
console.log("App listening on port 3001");
