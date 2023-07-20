var mongoose = require('mongoose')

var schema = mongoose.Schema({
    slug: String,
    name: String,
    type: String,
    vinculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'construction'
    },
    images: [],
    data: []
}, { timestamps: true });

module.exports = mongoose.model("construction", schema);