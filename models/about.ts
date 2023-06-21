var mongoose = require('mongoose')

var schema = mongoose.Schema({
    text: String,
    images: []
}, {
    timestamps: true
})

module.exports = mongoose.model('about', schema)