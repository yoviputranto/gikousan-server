const Customer = require('../../models/Customer');
const Shopping = require('../../models/Shopping');
const mongoose = require("mongoose");


module.exports={
    reportPerUser: async(req,res)=>{
        try {
            // const shoptype = req.query.shoptype;
            //console.log(req.params.id);
            const shopping = await Shopping.find({customer_id:req.params.id})
            res.status(200).json({success: true, data : shopping});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
    },
    reportPerCategory: async(req,res)=>{
        try {
            const shopping = await Shopping.find({shop_category_id:req.params.id});
            const category_id = new mongoose.Types.ObjectId(req.params.id);
            const data = await Shopping.aggregate([
                {
                    $lookup: {
                      from: "customers", // events collection name
                      localField: "customer_id",
                      foreignField: "_id",
                      as: "customer",
                    },
                },

                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:{
                        shop_category_id:category_id,
                        "customer.name" :{$ne:null}
                    }
                },
                {
                    $group:{
                        "_id":"$customer._id",
                        name : {$first : "$customer.name"},
                        products: {
                            $push: {
                              product_name: "$product_name",
                              product_qty: "$product_qty",
                              price : "$price"
                            }
                        },
                        
                    }
                }
            ])
            // const customerShoppingBasedOnCategory = await Customer.find().populate({
            //     path : "Shopping",
            //     match : {shop_category_id:req.params.id}
            // })
            // console.log(customerShoppingBasedOnCategory)
            // //console.log(data)
            res.status(200).json({success: true, data : data});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
    }
}