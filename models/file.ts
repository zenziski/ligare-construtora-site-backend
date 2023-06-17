var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String,
    location: String
}, { timestamps: true });

module.exports = mongoose.model("files", schema);