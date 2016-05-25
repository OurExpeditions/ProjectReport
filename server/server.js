// set up ======================================================================
var express = require('express'); // create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 7777; 				// set the port
var database = require('./config/database'); 		// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
//var flash = require('connect-flash');
//var localStrategy = require('passport-local').LocalStrategy;

// configuration ===============================================================
// Connect to local MongoDB instance.
mongoose.connect(database.localUrl);

// user schema/model
//var userSchema = require('./app/models/UserSchemas.js');

// routes ======================================================================
var routes = require('./app/routes.js');

var app = express();

//app.use(express.static(__dirname + '../client')); // set the static files location /public/img will be /img for users
app.use(express.static(path.join(__dirname, '../client')));
// set the static file info outer public folders images, assets info
//app.use('/components', express.static(__dirname + '/components'));
//app.use('/lib', express.static(__dirname + '../client/lib'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(bodyParser.urlencoded({'extended': 'false'})); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
//app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// configure passport

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});
// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var userRoutes = require('./app/index')(passport);
app.use('/defect/', userRoutes);

// error handlers
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
