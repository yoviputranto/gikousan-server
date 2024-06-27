const mongoose = require("mongoose");

const paymentmethodSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    icon:{
        type: String,
        required: true
    },
    is_active:{
        type:Boolean
    }
})

module.exports = mongoose.model('PaymentMethod', paymentmethodSchema);