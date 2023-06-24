var mongoose = require('mongoose')

var schema = mongoose.Schema({
    images: []
}, {
    timestamps: true
})

module.exports = mongoose.model('home_slider', schema)