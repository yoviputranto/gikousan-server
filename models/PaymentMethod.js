const mongoose = require("mongoose");

const paymentmethodSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    icon:{
        type: String,
    },
    is_active:{
        type:Boolean
    }
})

module.exports = mongoose.model('PaymentMethod', paymentmethodSchema);