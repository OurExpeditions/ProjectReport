var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/home');
};
module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', function (req, res, next) {
		passport.authenticate('login', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json({
					err: info
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					return res.status(500).json({
						err: 'Could not log in user'
					});
				}
				res.status(200).json({
					status: 'Login successful!',
					user: user
				});
			});
		})(req, res, next);
	});

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', function(req, res, next){
		passport.authenticate('signup') (req, res, function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (user) {
				return res.status(401).json({
					err: info
				});
			}
			//console.log(res.status, res.statusCode);
			return res.status(200).json({
				status: 'Registration successful!'
			});
		});
	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.status(200).json({
			status: 'Bye!'
		});
	});

	return router;
};





