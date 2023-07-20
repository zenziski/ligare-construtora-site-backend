var mongoose = require('mongoose')

var schema = mongoose.Schema({
    description: String,
    construction: {
        name: String,
        image: String,
    },
    project: {
        name: String,
        image: String,
    },
    reform: {
        name: String,
        image: String,
    },
    imagemPrincipal: String
}, {
    timestamps: true
})

module.exports = mongoose.model('home', schema)