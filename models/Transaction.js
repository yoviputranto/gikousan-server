const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
    
    is_in:{
        type: Boolean,
        required: true
    },
    admin_id:[{
        type: ObjectId,
        ref: 'Admin'
    }],
    payment_method_id:[{
        type: ObjectId,
        ref: 'PaymentMethod'
    }],
    customer_id:[{
        type: ObjectId,
        ref: 'Customer'
    }],
    issued_at:{
        type: Date
    }
})

module.exports = mongoose.model('Transaction', transactionSchema);