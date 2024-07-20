const Customer = require('../../models/Customer');
const Shopping = require('../../models/Shopping');
const ShopType = require('../../models/ShopType');
const ShopCategory = require('../../models/ShopCategory');
const mongoose = require("mongoose");


module.exports={
    listReportUser: async(req,res)=>{
        try {
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const search = req.query.search;
            let filter = {};
            filter["customer.name"] = {$ne:null}
            if(search){
                filter["customer.name"] = {$regex : '.*' + search + '.*', $options:'i'}
            }
            console.log(filter)
            const shopping = await Shopping.aggregate([
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
                    $match:filter
                },
                {
                    $group:{
                        "_id":"$customer._id",
                        name : {$first : "$customer.name"},
                        phone : {$first: "$customer.phone"},
                        instagram : {$first : "$customer.instagram"},
                        bill : {$sum: "$bill"},
                        
                        
                    }
                },
                {
                    $skip:(page > 0 ? page - 1 : page)*pageSize
                },
                {
                    $limit:pageSize
                },
                
            ])

            const count = await Shopping.aggregate([
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
                    $match:filter
                },
                {
                    $group:{
                        "_id":"$customer._id"
                        
                    }
                },
                
                
            ])
            console.log(shopping);
            res.status(200).json({success: true, 
                data:shopping,  
                totalPages:Math.ceil(count.length/pageSize),
                page: page});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
    },
    reportPerUser: async(req,res)=>{
        try {
            // const shoptype = req.query.shoptype;
            //console.log(req.params.id);
            const shopping = await Shopping.find({customer_id:req.params.id})
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
                    $lookup: {
                      from: "shopcategories", // events collection name
                      localField: "shop_category_id",
                      foreignField: "_id",
                      as: "shopcategory",
                    },
                },
                {
                    $lookup: {
                      from: "shoptypes", // events collection name
                      localField: "shopcategory.shop_type_id",
                      foreignField: "_id",
                      as: "shoptype",
                    },
                },

                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$shopcategory',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$shoptype',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:{
                        customer_id : customer_id
                    }
                },
                {
                    $group:{
                        "_id":"$shopcategory.shop_type_id",
                        name : {$first : "$shoptype.name"},
                        bill : {$sum : "$bill"},
                        shoppings: {
                            $push: {
                              _id : "$_id",
                              product_name: "$product_name",
                              product_qty: "$product_qty",
                              price : "$price",
                              status:"$status"
                            }
                        },
                        
                    }
                }
            ])
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
    },
    listReportCategory:async(req,res)=>{
        try {
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const shopType = req.query.shopType;
            let shopTypeName = shopType.replace('-',' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
            
            console.log(shopTypeName)
            const dataShopType = await ShopType.findOne({name:shopTypeName}); 
            console.log(!dataShopType);
            const search = req.query.search;
            let filter = {}; 
            if(dataShopType){
                filter.shop_type_id = dataShopType._id
            }
            if(search){
                filter.name = {$regex : '.*' + search + '.*', $options:'i'}
            }
            console.log(filter)
            const data = await ShopCategory.find(filter)
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await ShopCategory.find(filter).countDocuments();
            
            return res.status(200).json({
                success:true, 
                data, 
                totalPages:Math.ceil(count/pageSize),
                page: page
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    }
}