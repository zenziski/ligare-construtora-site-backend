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
    data: [],
    mainImage: String,
    ordem: Number
}, { timestamps: true });

module.exports = mongoose.model("construction", schema);