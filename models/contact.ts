var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    description: String,
}, { timestamps: true });

module.exports = mongoose.model("contact", schema);