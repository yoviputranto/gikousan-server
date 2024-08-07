const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transactiondetailSchema = new mongoose.Schema({
    
    paid_amount:{
        type: Number,
        required: true
    },
    shop_name:{
        type:String
    },
    description:{
        type:String
    },
    transaction_id:[{
        type: ObjectId,
        ref: 'PaymentMethod'
    }],
    shopping_id:[{
        type: ObjectId,
        ref: 'Customer'
    }],
    created_at:{
        type:Date
    }
})

module.exports = mongoose.model('TransactionDetail', transactiondetailSchema);