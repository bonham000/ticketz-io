var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
		name: {type: String, required: true},
    ownerEmail: {type: String, required: true, unique: true},
    logo: String,
		plan: String //free, pro, plus
});

var Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;