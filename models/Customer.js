const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    instagram:{
        type: String
    },
    tiktok:{
        type: String
    },
    created_at:{
        type: Date
    }
})

module.exports = mongoose.model('Customer', customerSchema);