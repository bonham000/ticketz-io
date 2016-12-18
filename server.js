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

//Database Modules, and establishing connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://helpnetadmin:helpnetadmin@ds023475.mlab.com:23475/helpnet');
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
    secret: 'OrEGan0zPizzaC0oK1e',
    cookie: {maxAge: 1000*60*60*8},//ms*s*m*h
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.post('/api/login', passport.authenticate('local', {failureRedirect: '/app/login'}),
    function(req, res){
			  res.redirect('/admin');
    }
);
app.get('/api/logout', function(req, res){
	req.logout();
	res.send(true);
});





//CRUD APIs
//CREATE: New ticket is submitted
app.post('/api/newticket', function(req, res){
	var data = req.body;
	data.email = data.email.toLowerCase();
	data.status = 'New';
	data.assignedto = '';
	data.note = '';
	data.date = moment().format('MMMM DD YYYY, h:mm a');
	data._id = _idcount;
	_idcount ++;
	
	var newticket = new Ticket(data);
	newticket.save(function(err){
		if (err) throw err;
		console.log(req.body.name + ' has just submitted a ticket!');
		res.end();
	});
});
//CREATE: makes a new admin account
app.post('/api/createadmin', function(req, res){
		User.findOne({username: req.body.username.toLowerCase()}, function (err, user) {
			if (err) throw err;
			if (user) res.status(500).send('Username already exists.');
			else {
				var newuser = new User(req.body);
				newuser.save(function (err) {
					if (err) throw err;
					res.end()
				});
			}
		})
});



//READ: User checks the status on their tickets
app.get('/api/check/:email', function(req, res){
	console.log(req.params.email + " requested info on their current work orders");
	Ticket.find({email: req.params.email.toLowerCase()})
		.sort([['date', 'descending']])
		.limit(10)
		.exec(function(err, tickets){if (err) throw err; res.send(tickets)});
});
//READ: sends true if user is authorized, or else returns false
app.get('/api/validateAuth', function(req, res){
	if (req.user) {
		User.findOne({username: req.user.username}, function(err, user){
			if (err) throw err;
			res.send(user)
		})
	}
	else res.send(false)
})
//READ: sends the names of the users in same dpt
app.get('/api/initialData', function(req, res){
    User.find({dpt: req.user.dpt}, function(err, users){
        if (err) throw err;
        res.send(users);
    })
});
//READ:
//Handles all the advanced search functionality.
//Just make a POST request, with a JSON object of your search params!
app.post('/api/querytickets', function(req, res){
	if (req.body.assignedto === 'true') req.body.assignedto = req.user.username
	if (req.body.description) req.body.description = new RegExp(req.body.description, "i")
	req.body.dpt = req.user.dpt;
	Ticket.find(req.body).sort({date: -1}).exec(function(err, tickets){
		if (err) throw err;
		res.send(tickets);
	})
})



//UPDATE: updates assignee
app.get('/api/updateassignee/:id/:assignee', function(req, res){
	Ticket.update({_id: req.params.id}, {assignedto: req.params.assignee}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: updates note on the ticket
app.put('/api/updatenote/', function(req, res){
	Ticket.update({_id: req.body.id}, {note: req.body.note}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: route a ticket to opposite dpt
app.get('/api/routeticket/:id/:newdpt', function(req, res){
	Ticket.update({_id: req.params.id}, {dpt: req.params.newdpt}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: mark a ticket as complete
app.get('/api/completeticket/:id', function(req, res){
	Ticket.update({_id: req.params.id}, {status: "Complete", assignedto: req.user.username}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: update user data
app.put('/api/editadmin', function(req, res){
	User.update({username: req.body.username.toLowerCase()}, req.body, function(err, updated){
		if (err) throw err;
		res.end();
	})
})
//UPDATE: updates the task for a user
app.put('/api/updatetask', function(req, res){
	User.update({username: req.body.username}, {task: req.body.task}, function(err, updated){
		if (err) throw err;
		res.end()
	})
})
//UPDATE: updates password when a user submits password change
app.put('/api/updatepassword', function(req, res){
	User.findOne({username: req.user.username}, function(err, user){
		user.password = req.body.password
		console.log(user);
		user.save()
		res.send();
	})
})




//DELETE: Delete a user
app.delete('/api/deleteadmin', function(req, res){
	User.remove({username: req.body.username}, function(err){
		if (err) throw err;
		res.end()
	});
})




//Serve the pages
//The plain old HTML/CSS/Javascript pages (home, signup, login, and submit ticket)
app.use(express.static(path.join(__dirname, '/client/site')));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '/client/site/index.html'))
});
app.get('/signup', function(req, res){
	res.sendFile(path.join(__dirname, '/client/site/signup.html'))
});
app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, '/client/site/login.html'))
})
//Serve the webpack bundle --
//The fancy react/react-router dashboard!
app.use(express.static(path.join(__dirname, '/client/dashboard/build')));
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/client/dashboard/build/index.html'));
});

//Listen
var port = process.env.PORT || 3001;
app.listen(port, function(){
    console.log('server listening on port ' + port);
});