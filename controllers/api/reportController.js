const Customer = require('../../models/Customer');
const Shopping = require('../../models/Shopping');
const ShopType = require('../../models/ShopType');
const ShopCategory = require('../../models/ShopCategory');
const TransactionDetail = require('../../models/TransactionDetail');
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
            
            const customer = await Customer.findById(req.params.id);
            const shopping = await Shopping.find({customer_id:req.params.id})
            const customer_id = new mongoose.Types.ObjectId(req.params.id);
            const filter = {};
            filter.customer_id = customer_id;
            if(req.query.shopType){
                const shop_type_id = new mongoose.Types.ObjectId(req.query.shopType);
                filter["shopcategory.shop_type_id"] = shop_type_id;
            }
            
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
                    $match:filter
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
            const totalBill= await Shopping.aggregate([
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
                    $match :filter
                },
                {
                    $group:{
                        "_id":null,
                        total_bill : {$sum:"$bill"}
                    }
                }
            ])
            res.status(200).json({success: true, data : data, totalBill:totalBill[0].total_bill, customerName:customer.name});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
    },
    historyPerUser:async(req,res)=>{
        try {
            const customer_id = new mongoose.Types.ObjectId(req.params.id);
            let filterShopping = {};
            filterShopping.customer_id = customer_id;
            filterShopping["shoptype.name"] = {$ne : null};
            let filterTransaction = {};
            filterTransaction["transaction.customer_id"] = customer_id
            if(req.query.startDate && req.query.endDate){
                filterTransaction["transaction.issued_at"] = {
                    $gte:new Date(req.query.startDate),
                    $lte:new Date(req.query.endDate)
                }
                filterShopping.shopping_date = {
                    $gte:new Date(req.query.startDate),
                    $lte:new Date(req.query.endDate)
                }
            }else if(req.query.startDate){
                filterTransaction["transaction.issued_at"] = {$gte:new Date(req.query.startDate)}
                filterShopping.shopping_date = {$gte:new Date(req.query.startDate)}
            }else if(req.query.endDate){
                filterTransaction["transaction.issued_at"] = {$lte:new Date(req.query.endDate)}
                filterShopping.shopping_date = {$lte:new Date(req.query.endDate)}
            }
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
                    $match:filterShopping
                },
                {
                    $group:{
                        "_id":{$first:"$shopcategory.shop_type_id"},
                        name : {$first : "$shoptype.name"},
                        shoppings: {
                            $push: {
                              _id : "$_id",
                              product_name: "$product_name",
                              category_name: "$shopcategory.name",
                              date:"$shopping_date"
                            }
                        },
                        
                    }
                }
            ])
            const transaction = await TransactionDetail.aggregate([
                {
                    $lookup: {
                      from: "transactions", // events collection name
                      localField: "transaction_id",
                      foreignField: "_id",
                      as: "transaction",
                    },
                },
                {
                    $lookup: {
                      from: "paymentmethods", // events collection name
                      localField: "transaction.payment_method_id",
                      foreignField: "_id",
                      as: "paymentmethod",
                    },
                },
                {
                    $lookup: {
                      from: "customers", // events collection name
                      localField: "transaction.customer_id",
                      foreignField: "_id",
                      as: "customer",
                    },
                },
                {
                    $unwind: {
                        path: '$transaction',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$paymentmethod',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filterTransaction
                },
                {
                    $group:{
                        "_id":{$first:"$transaction_id"},
                        title : {$first:{$cond:{
                            if:{$eq:["$transaction.is_in",true]},
                            then:"Pembayaran",
                            else:"Pembelian"}}},
                        description : {$addToSet:"$shop_name"},
                        total : {$sum : "$paid_amount"},
                        is_in : {$first : "$transaction.is_in"},
                        date : {$first : "$transaction.issued_at"},
                        payment_name : {$first:"$paymentmethod.name"}
                    }
                }
            ])

            return res.status(200).json({success: true, data:{shopping,transaction}})
        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },
    reportPerCategory: async(req,res)=>{
        try {
            let data = {};
            const category = await ShopCategory.findById(req.params.id);
            data.name = category.name;
            data.batch = category.batch;
            const shopping = await Shopping.find({shop_category_id:req.params.id});
            const category_id = new mongoose.Types.ObjectId(req.params.id);
            const totalBill = await Shopping.aggregate([
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
                        "_id":null,
                        total : {$sum : "$price"}
                        
                    }
                }
            ])
            data.total = totalBill[0].total;
            const dataShopping = await Shopping.aggregate([
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
                              price : "$price",
                              status:"$status"
                            }
                        },
                        
                    }
                }
            ])
            data.detail = dataShopping;
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