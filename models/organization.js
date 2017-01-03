var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var organizationSchema = new Schema({
	ownerName: String,
  	ownerEmail: {type: String, required: true, unique: true},
	orgName: String,
	url: String,
	orgPassword: String,
	date: String,
	sites: Array
});

var Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;