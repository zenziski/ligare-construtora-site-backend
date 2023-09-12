var mongoose = require('mongoose')

var schema = mongoose.Schema({
    description: String,
    construction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'construction'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'construction'
    },
    reform: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'construction'
    },
    imagemPrincipal: String,
    capaObras: String
}, {
    timestamps: true
})

module.exports = mongoose.model('home', schema)