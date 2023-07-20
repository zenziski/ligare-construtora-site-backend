var mongoose = require('mongoose')

var schema = mongoose.Schema({
    whoWeAre: String,
    imagemPrincipal: String,
    team: String
}, {
    timestamps: true
})

module.exports = mongoose.model('about', schema)