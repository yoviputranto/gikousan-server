const mongoose = require("mongoose");


const shoptypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    created_at:{
        type:Date
    }
})

module.exports = mongoose.model('ShopType', shoptypeSchema);