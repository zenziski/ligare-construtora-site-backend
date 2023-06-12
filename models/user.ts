const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isBlocked: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    validation: {
        isValidated: {type: Boolean, default: false},
        validationCode: Number
    },
    permission: {type: String, default: 'common'},
    cpf: String
}, { timestamps: true });

module.exports = mongoose.model("user", schema);