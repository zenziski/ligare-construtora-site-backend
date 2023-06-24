var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, { timestamps: true });

module.exports = mongoose.model("user", schema);