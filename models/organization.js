var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
	ownerName: String,
  	ownerEmail: {type: String, required: true, unique: true},
	orgName: String,
	orgPassword: String,
	domain: String,
	date: String,
	sites: Array
});

var Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;