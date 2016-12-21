var path = require('path');
var moment = require('moment');

var express = require("express");
var router = express.Router();

//Database Modules, and establishing connection
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Ticket = require('./models/ticket.js');
var Organization = require('./models/organization.js');

//this _idcount variable makes sure that when a new ticket is submitted,
//its _id will always be one more than the last ticket submitted
var _idcount = 0;
mongoose.connection.on('connected', function () {
    Ticket.find({}, {_id: 1}).sort([['_id', 'descending']])
        .exec(function(err, tickets){
            if (err) throw err;
            _idcount = tickets.length ? tickets[0]._id + 1 : 0;
        })
});


//CRUD APIs
//CREATE: Create new organization
router.get('/api/checkdomain/:email', function(req, res){
	Organization.find({ownerEmail: req.params.email}, function(err, orgs){
		if (err) throw err;
		if (orgs.length === 0) { res.status(200).send() }
		else { res.status(500).send() }
	})
})

router.post('/api/createorg', function(req, res){

	var orgdata = req.body
	orgdata.date = moment().format('MMMM DD YYYY, h:mm a');
	var neworg = new Organization(orgdata)
	neworg.save(function(err){
		if (err) throw err;
		console.log(req.body.domain + ' is registering an account...')

		var userdata = {
			name: req.body.ownerName,
			username: req.body.ownerEmail,
			password: req.body.ownerPassword,
			role: 'owner',
			organization: orgdata.orgName
		};

		var newuser = new User(userdata)
		newuser.save(function(err){
			if (err) throw err;
			console.log('User added successfully: ', newuser);
			res.end()
		})
	})
});

router.get('/api/organizations', function(req, res) {
	Organization.find({}, function(err, docs) {
		if (!err) {
			console.log(docs);
			res.status(201).send(docs);
		};
	});
});


//CREATE: New ticket is submitted
router.post('/api/new-ticket', function(req, res){
	var ticket = req.body;
	var password = ticket.password;
	console.log(password);
	// verify organization password here
	// successful, submit new ticket and send status 200 to client
	delete ticket.password;
	ticket.status = "New";
	ticket.assignedto = '';
	ticket.note = '';
	ticket.date = moment().format('MMMM DD YYYY, h:mm a');
	ticket._id = _idcount;
	_idcount ++;

	console.log(ticket);

	res.send(200);
	
	// var newticket = new Ticket(ticket);
	// newticket.save(function(err){
	// 	if (err) throw err;
	// 	console.log(req.body.name + ' has just submitted a ticket!');
	// 	res.end();
	// });

	// if password is not valid, return unauthorized message, this
	// will need to be handled in the new ticket component

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
//READ: sends the initial data for the portal
router.get('/api/initialData', function(req, res){
	var responses = 0
	var data = {};
    User.find({organization: req.user.organization}, function(err, admins){ //finds all other users in organization
        if (err) throw err;
        data.admins = admins
        responses++
        sendSyncResult()
    })
	Organization.findOne({orgName: req.user.organization}, function(err, org){
		if (err) throw err;
		data.organization = org
		responses++
		sendSyncResult()
    })
    function sendSyncResult(){
    	if (responses === 2) {
    		res.send(JSON.stringify(data))
    	};
    }
});
//READ:
//Handles all the advanced search functionality.
//Just make a POST request, with a JSON object of your search params!
router.post('/api/querytickets', function(req, res){
	console.log(req.user);
	if (req.body.description) req.body.description = new RegExp(req.body.description, "i")
	req.body.organization = req.user.organization
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




//Serve the webpack bundle --
//The fancy react/react-router dashboard!
router.use(express.static(path.join(__dirname, '/client/dashboard/build')));
router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/client/dashboard/build/index.html'));
});

module.exports = router;
