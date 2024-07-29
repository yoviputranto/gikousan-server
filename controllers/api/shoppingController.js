const Shopping = require('../../models/Shopping');
const ShopCategory = require('../../models/ShopCategory');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');
const ShopType = require('../../models/ShopType');
const mongoose = require("mongoose");
const { timeStamp } = require('console');

const validationRules = {
    price: 'required|integer',
    product_name: 'string',
    product_qty: 'integer',
    category:'string',
    shop_category_id:'required',
    customer_id:'required',
    status:'required'
};

module.exports= {
    createShopping: async(req,res)=>{
        try{
            const{
                price,
                product_name,
                product_qty,
                shop_category_id,
                customer_id,
                category,
                status
            } = req.body;
            
            const dataShopping = {
                price : price,
                product_name : product_name,
                product_qty : product_qty,
                shop_category_id : shop_category_id,
                customer_id : customer_id,
                category : category,
                status : status,
                bill : price,
                shopping_date : new Date()
            }
            const validation = new Validator(dataShopping,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            if(req.file != undefined){
                dataShopping.product_image = `images/${req.file.filename}`;
            }

            const shopcategory = await ShopCategory.findOne({_id : shop_category_id});
            if(!shopcategory){
                return res.status(404).json({ message:"ShopCategory not found"});
            }

            const customer = await Customer.findById(customer_id);
            if(!customer){
                return res.status(404).json({message:"Customer not found"});
            }
    
            const data = await Shopping.create(dataShopping);
    
            res.status(201).json({ success: true, message : "Data created", data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message : " Internal Server Error"});
        }
        

        
    },

    editShopping: async(req,res)=>{
        try{
            const{
                price,
                product_name,
                product_qty,
                shop_category_id,
                customer_id,
                category,
                status
            } = req.body;
            
            const shopping = {
                price : price,
                product_name : product_name,
                product_qty : product_qty,
                shop_category_id : shop_category_id,
                customer_id : customer_id,
                category : category,
                status : status
            }
            const validation = new Validator(shopping,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }

            const dataShopping = await Shopping.findById(req.params.id);
            if(!dataShopping){
                return res.status(404).json({success:false, message:"shopping not found"});
            }
            
            let product_image = '';
            if(req.file != undefined && dataShopping.product_image != null){
                await fs.unlink(path.join(`public/${dataShopping.product_image}`));
                product_image = `images/${req.file.filename}`
                shopping.product_image = product_image;
            }else if(dataShopping.product_image != null){
                product_image = dataShopping.product_image
                shopping.product_image = product_image;
            }
            const data = await Shopping.findByIdAndUpdate({_id:req.params.id},shopping,{new:true});
            return res.status(200).json({success: true, data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message: "Internal Server Error"});
        }
        
    },

    readDetailShopping: async(req,res)=>{
        try{
            const data = await Shopping.findById(req.params.id);
            console.log(data);
            // if(!data){
            //     return res.status(404).json({success:false,message:"Data not found"});
            // }
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    readShopping: async(req,res)=>{
        try{
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const shopType = req.query.shopType;
            let customer = '';
            if(req.query.customer){
                console.log(req.query.customer)
                const dataCustomer = await Customer.findById(req.query.customer)
                if(!dataCustomer){
                    res.status(404).json({success:false, message:"Customer Not Found"})
                }
                console.log(dataCustomer)
                customer = dataCustomer._id;
            }
            console.log(customer)
            const filterCustomer = customer ? customer : {$ne:null}
            let shopTypeName = shopType.replace('-',' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
            const dataShopType = await ShopType.findOne({name:shopTypeName});
           
            const filterShopType = dataShopType ? dataShopType._id : {$ne:null}
            const search = req.query.search;
            let filter = {}; 
            filter["shopcategory.shop_type_id"] = filterShopType;
            filter.customer_id = filterCustomer;
            if(search){
                filter.product_name = {$regex : '.*' + search + '.*', $options:'i'}
            }
            // console.log(filterShopType)
            const data = await Shopping.aggregate([
                {
                    $lookup: {
                      from: "shopcategories", // events collection name
                      localField: "shop_category_id",
                      foreignField: "_id",
                      as: "shopcategory",
                    },
                },
                {
                    $unwind: {
                        path: '$shopcategory',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filter
                },
                {
                    $skip:(page > 0 ? page - 1 : page)*pageSize
                },
                {
                    $limit:pageSize
                },
                {
                    $project: {
                        "shopcategory.batch":0,
                        "shopcategory.place":0,
                        "shopcategory._id":0,
                        "shopcategory.__v":0,
                        "shopcategory.shop_type_id":0
                    }
                },
                {
                    $sort:{shopping_date:-1}
                }
            ])
            const count = await Shopping.aggregate([
                {
                    $lookup: {
                      from: "shopcategories", // events collection name
                      localField: "shop_category_id",
                      foreignField: "_id",
                      as: "shopcategory",
                    },
                },
                {
                    $unwind: {
                        path: '$shopcategory',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filter
                }
            ])
            // if(data.length == 0){
            //     return res.status(404).json({success: false, message:"Data not found"});
            // }
            return res.status(200).json({
                success:true, 
                data, 
                totalPages:Math.ceil(count.length/pageSize),
                page: page
            });
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    deleteShopping: async(req,res)=>{
        try{
            const data = await Shopping.findById(req.params.id);
            if(data.product_image){
                await fs.unlink(path.join(`public/${data.product_image}`))
            }
            
            const shopping = await Shopping.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    },

    listShoppingTransaction: async(req, res)=>{
        try {
            const shopping = await Shopping.find({shop_category_id:req.params.id});
            const customer_id = new mongoose.Types.ObjectId(req.params.id);
            
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
                        customer_id : customer_id,
                        status:"Belum Lunas"
                    }
                },
                {
                    $group:{
                        "_id":"$shopcategory.shop_type_id",
                        name : {$first : "$shoptype.name"},
                        shoppings: {
                            $push: {
                              _id : "$_id",
                              product_name: "$product_name",
                              product_qty: "$product_qty",
                              price : "$price"
                            }
                        },
                        
                    }
                }
            ])
            res.status(200).json({success: true, data : data});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
    }
}