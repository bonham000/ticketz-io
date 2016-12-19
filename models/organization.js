var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
	orgName: {type: String, required: true},
    ownerEmail: {type: String, required: true, unique: true},
	submittalPassword: String
});

var Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;