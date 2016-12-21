var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    _id: Number,
    name: String,
    email: String,
    phone: String,
    site: String,
    room: String,
    description: String,
    status: String,
    assignedto: String,
    note: String,
    date: String
});

var Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;