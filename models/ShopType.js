const mongoose = require("mongoose");


const shoptypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    }
})

module.exports = mongoose.model('ShopType', shoptypeSchema);