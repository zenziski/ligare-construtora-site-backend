var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String
}, { timestamps: true });

module.exports = mongoose.model("contactImage", schema);