//Require process.env variables
//uses the "dotenv" npm package
//create local variables by making a .env file in root directory here, then
//add them in KEY=VALUE format i.e.  -----  MONGO_URL=mongodb://mydb
require('dotenv').config({silent: true});

//Core Modules
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser');

//Authentication Modules
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var bcrypt = require('bcryptjs');

//Express Modules
var express = require('express');
var app = express();

var routes = require("./routes.js");

//Database Modules, and establishing connection
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
var User = require('./models/user.js');
var Ticket = require('./models/ticket.js');
var Organization = require('./models/organization.js');
var _idcount = 0;
mongoose.connection.on('connected', function () {
    Ticket.find({}, {_id: 1}).sort([['_id', 'descending']])
        .exec(function(err, tickets){
            if (err) throw err;
            _idcount = tickets.length ? tickets[0]._id + 1 : 0;
        })
});





//Middlewares AND authentication
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Authentication Middleware
passport.use(new LocalStrategy(
    function (username, password, done){
        User.findOne({username: username.toLowerCase()}, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {message: 'Incorrect Username.'});
            }
            if (!bcrypt.compareSync(password, user.password)){
                return done(null, false, {message: 'Incorrect Password'});
            }
            return done(null, user);
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 1000*60*60*8},//ms*s*m*h
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use("/",routes);



//Listen
var port = process.env.PORT || 3001;
app.listen(port, function(){
    console.log('server listening on port ' + port);
});