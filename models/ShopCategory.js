const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const shopcategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    place:{
        type: String
    },
    batch:{
        type: Number
    },
    product_image:{
        type: String
    },
    shop_type_id:[{
        type: ObjectId,
        ref: 'ShopType'
    }],
    date:{
        type:Date
    }
})

module.exports = mongoose.model('ShopCategory', shopcategorySchema);