var express = require("express");
var router = express.Router();

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

app.post('/api/login', passport.authenticate('local', {failureRedirect: '/app/login'}),
    function(req, res){
			  res.redirect('/admin');
    }
);

router.get('/api/logout', function(req, res){
	req.logout();
	res.send(true);
});





//CRUD APIs
//CREATE: New ticket is submitted
router.post('/api/newticket', function(req, res){
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
router.post('/api/createadmin', function(req, res){
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
router.get('/api/check/:email', function(req, res){
	console.log(req.params.email + " requested info on their current work orders");
	Ticket.find({email: req.params.email.toLowerCase()})
		.sort([['date', 'descending']])
		.limit(10)
		.exec(function(err, tickets){if (err) throw err; res.send(tickets)});
});
//READ: sends true if user is authorized, or else returns false
router.get('/api/validateAuth', function(req, res){
	if (req.user) {
		User.findOne({username: req.user.username}, function(err, user){
			if (err) throw err;
			res.send(user)
		})
	}
	else res.send(false)
})
//READ: sends the names of the users in same dpt
router.get('/api/initialData', function(req, res){
    User.find({dpt: req.user.dpt}, function(err, users){
        if (err) throw err;
        res.send(users);
    })
});
//READ:
//Handles all the advanced search functionality.
//Just make a POST request, with a JSON object of your search params!
router.post('/api/querytickets', function(req, res){
	if (req.body.assignedto === 'true') req.body.assignedto = req.user.username
	if (req.body.description) req.body.description = new RegExp(req.body.description, "i")
	req.body.dpt = req.user.dpt;
	Ticket.find(req.body).sort({date: -1}).exec(function(err, tickets){
		if (err) throw err;
		res.send(tickets);
	})
})



//UPDATE: updates assignee
router.get('/api/updateassignee/:id/:assignee', function(req, res){
	Ticket.update({_id: req.params.id}, {assignedto: req.params.assignee}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: updates note on the ticket
router.put('/api/updatenote/', function(req, res){
	Ticket.update({_id: req.body.id}, {note: req.body.note}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: route a ticket to opposite dpt
router.get('/api/routeticket/:id/:newdpt', function(req, res){
	Ticket.update({_id: req.params.id}, {dpt: req.params.newdpt}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: mark a ticket as complete
router.get('/api/completeticket/:id', function(req, res){
	Ticket.update({_id: req.params.id}, {status: "Complete", assignedto: req.user.username}, function(err, ticket){
		if (err) throw err;
	})
})
//UPDATE: update user data
router.put('/api/editadmin', function(req, res){
	User.update({username: req.body.username.toLowerCase()}, req.body, function(err, updated){
		if (err) throw err;
		res.end();
	})
})
//UPDATE: updates the task for a user
router.put('/api/updatetask', function(req, res){
	User.update({username: req.body.username}, {task: req.body.task}, function(err, updated){
		if (err) throw err;
		res.end()
	})
})
//UPDATE: updates password when a user submits password change
router.put('/api/updatepassword', function(req, res){
	User.findOne({username: req.user.username}, function(err, user){
		user.password = req.body.password
		console.log(user);
		user.save()
		res.send();
	})
})




//DELETE: Delete a user
router.delete('/api/deleteadmin', function(req, res){
	User.remove({username: req.body.username}, function(err){
		if (err) throw err;
		res.end()
	});
})




//Serve the pages
//The plain old HTML/CSS/Javascript pages (home, signup, login, and submit ticket)
router.use(express.static(path.join(__dirname, '/client/site')));
router.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '/client/site/index.html'))
});
router.get('/signup', function(req, res){
	res.sendFile(path.join(__dirname, '/client/site/signup.html'))
});
router.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, '/client/site/login.html'))
})
//Serve the webpack bundle --
//The fancy react/react-router dashboard!
router.use(express.static(path.join(__dirname, '/client/dashboard/build')));
router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/client/dashboard/build/index.html'));
});

module.exports = router;