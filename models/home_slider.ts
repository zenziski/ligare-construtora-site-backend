var mongoose = require('mongoose')

var schema = mongoose.Schema({
    images: [],
    title: String,
    description: String
}, {
    timestamps: true
})

module.exports = mongoose.model('home_slider', schema)