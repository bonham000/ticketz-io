var path = require('path');
var moment = require('moment');
var bcrypt = require('bcryptjs');
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
//CREATE: Someone registers to create an organization & a new user
router.post('/api/createorg', function(req, res){

	var orgdata = req.body
	orgdata.date = moment().format('MMMM DD YYYY, h:mm a');
	orgdata.url = orgdata.orgName.toLowerCase().replace(/\W/g, '-');

	var neworg = new Organization(orgdata)
	console.log(neworg);
	neworg.save(function(err){
		if (err) throw err;
		console.log(req.body.ownerName + ' is registering an account...')

		var userdata = {
			name: req.body.ownerName,
			username: req.body.ownerEmail,
			password: req.body.ownerPassword,
			role: 'owner',
			organization: orgdata.url,
			monthCount: 0,
			allTimeCount: 0
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
			var urls = docs.reduce((orgs, org) => {
				return (orgs.indexOf(org.url) === -1) ? orgs.concat(org.url) : orgs;
			}, []);
			var organizations = docs.reduce((orgs, org) => {
				return (orgs.indexOf(org.orgName) === -1) ? orgs.concat(org.orgName) : orgs;
			}, []);
			res.status(201).send({ urls, organizations });
		};
	});
});


// api for submitting a new ticket
router.post('/api/new-ticket/:organization', function(req, response){
	var url = req.params.organization;
	var password = req.body.password;
	Organization.find({url: url}, function(err, org) {
		if (err) throw err;
		if (password === org[0].orgPassword) {
			var ticket = req.body;
			delete ticket.password;
			ticket.status = "New";
			ticket.assignedto = '';
			ticket.note = '';
			ticket.date = moment().format('MMMM DD YYYY, h:mm a');
			ticket.dateRaw = new Date();
			ticket._id = _idcount;
			ticket.organization = url;
			_idcount++;

			var newticket = new Ticket(ticket);
			console.log('New Ticker: ', newticket);
			newticket.save(function(err){
				if (err) throw err;
				console.log(req.body.name + ' has just submitted a ticket!');
			});

			response.send(200);
		} else {
			response.status(400).send('Password is invalid');
		}
	});
});

//CREATE: makes a new admin account
router.post('/api/createadmin', function(req, res){
	console.log('body: ' + req.body)
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
	Organization.findOne({url: req.user.organization}, function(err, org){
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
router.get('/api/querytodaystickets', function(req, res){
	var start = new Date(); start.setHours(0,0,0,0);
	var end = new Date(); end.setHours(23,59,59,999);
	Ticket.find({ dateRaw: { $gt: start, $lt: end } }, function(err, tickets) {
		if (err) throw err;
		res.send(tickets);
	})
})
//READ:
//Handles all the advanced search functionality.
//Just make a POST request, with a JSON object of your search params!
router.post('/api/querytickets', function(req, res){
	Ticket.find(req.body, function(err, tickets) {
		if (err) throw err;
		res.send(tickets);
	})
});

router.post('/api/organization-sites', function(req, res) {
	Organization.find({ url: req.body.org }, function(err, docs) {
		if (!err) {
			res.send({sites: docs[0].sites});
		};
	});
});

//UPDATE: updates assignee
router.get('/api/updateassignee/:id/:assignee', function(req, res){
	Ticket.update({_id: req.params.id}, {assignedto: req.params.assignee}, function(err, ticket){
		if (err) throw err;
		res.sendStatus(200);
	})
})
//UPDATE: updates note on the ticket
router.post('/api/updatenote/', function(req, res){
	Ticket.update({_id: req.body.id}, {note: req.body.note}, function(err, ticket){
		if (err) throw err;
		res.sendStatus(200);
	});
})
//UPDATE: mark a ticket as complete
router.get('/api/completeticket/:id', function(req, res){
	User.findOne({username: req.user.username.toLowerCase()}, function(err, user){
		if (err) throw err;
		user.monthCount++
		user.allTimeCount++
		user.save()
	})

	Ticket.update({_id: req.params.id}, {status: "Complete", assignedto: req.user.name}, function(err, ticket){
		if (err) throw err;
	})

	res.end()
})
//UPDATE: update user data
router.put('/api/editadmin', function(req, res){
	User.update({username: req.body.oldUsername}, req.body, function(err, updated){
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
//UPDATE: this api handles ALL organization updates -- just pass the new organization data in the body
router.put('/api/update-organization', function(req, res){
	Organization.findOneAndUpdate({url: req.body.url}, req.body, function(err, org){
		if (err) throw err;
	})
	res.send()
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
router.use(express.static(path.join(__dirname, '/client/build')));
router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

module.exports = router;
