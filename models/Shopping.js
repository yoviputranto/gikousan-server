const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const shoppingSchema = new mongoose.Schema({
    price:{
        type: Number,
        required: true
    },
    product_image:{
        type: String
    },
    product_name:{
        type: String
    },
    product_qty:{
        type: Number
    },
    shop_category_id:[{
        type: ObjectId,
        ref: 'ShopCategory'
    }],
    customer_id:[{
        type: ObjectId,
        ref: 'Customer'
    }],
    category:{
        type: String
    },
    status:{
        type:String,
        required : true
    }
})

module.exports = mongoose.model('Shopping', shoppingSchema);