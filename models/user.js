var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    name: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: String, //technician OR manager OR owner
	task: String, //managers and owners can assign tasks
    organization: String,
    monthCount: Number,
    allTimeCount: Number 
});
userSchema.pre('update', function(next){
    if (this.getUpdate().$set.password) {
			var p = this.getUpdate().$set.password
			p = bcrypt.hashSync(p, 10);
			this.getUpdate().$set.password = p
		}
    next();
})
userSchema.pre('save', function(next){
    this.username = this.username.toLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;