const Shopping = require('../../models/Shopping');
const ShopCategory = require('../../models/ShopCategory');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');

module.exports= {
    createShopping: async(req,res)=>{
        try{
            const{
                price,
                product_name,
                product_qty,
                shop_category_id,
                customer_id,
                category
            } = req.body;
            
            if(price == null || product_qty == null){
                return res.status(404).json({message:"Please fill all field"});
            }

            const shopcategory = await ShopCategory.findOne({_id : shop_category_id});
            if(!shopcategory){
                return res.status(404).json({ message:"ShopCategory not found"});
            }

            const customer = await Customer.findById(customer_id);
            if(!customer){
                return res.status(404).json({message:"Shopping not found"});
            }
            
            const dataShopping = {
                price : price,
                product_name : product_name,
                batch : batch,
                product_qty : product_qty,
                shop_category_id : shop_category_id,
                customer_id : customer_id,
                category : category
            }
    
            const shopping = await Shopping.create(dataShopping);
    
            res.status(201).json({ message : "Data created", shopping});
        }catch(error){
            console.log(error);
            return res.status(500).json({message : " Internal Server Error"});
        }
        

        
    },

    editShopping: async(req,res)=>{
        try{
            const body = req.body;
            
            console.log(req.body);
            const dataShopping = await Shopping.findById(req.params.id);
            console.log(dataShopping);
            const Shopping = await Shopping.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(Shopping);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailShopping: async(req,res)=>{
        try{
            const data = await Shopping.findById(req.params.id);
            console.log(data);
            if(!data){
                return res.status(404).json({message:"Data not found"});
            }
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    },

    readShopping: async(res)=>{
        try{
            const data = await Shopping.find();
            console.log(data);
            if(!data){
                return res.status(404).json({message:"Data not found"});
            }
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    },

    deleteShopping: async(req,res)=>{
        try{
            const data = await Shopping.findById(req.params.id);
            const shopping = await Shopping.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}