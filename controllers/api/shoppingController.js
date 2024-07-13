const Shopping = require('../../models/Shopping');
const ShopCategory = require('../../models/ShopCategory');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');

const validationRules = {
    price: 'required|integer',
    product_name: 'string',
    product_qty: 'integer',
    category:'string',
    shop_category_id:'required',
    customer_id:'required'
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
                status : status
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
            const data = await Shopping.find()
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await Shopping.countDocuments();
            console.log(data);
            // if(data.length == 0){
            //     return res.status(404).json({success: false, message:"Data not found"});
            // }
            return res.status(200).json({
                success:true, 
                data, 
                totalPages:Math.ceil(count/pageSize),
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
    }
}