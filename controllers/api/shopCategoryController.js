const ShopCategory = require('../../models/ShopCategory');
const ShopType = require('../../models/ShopType');
const fs = require('fs-extra');
const path = require('path');

module.exports= {
    createShopCategory: async(req,res)=>{
        try{
            const{
                name,
                place,
                batch,
                shop_type_id,
            } = req.body;
            
            if(name == null || shop_type_id == null){
                return res.status(404).json({message:"Please fill all field"});
            }
            const shoptype = await ShopType.findOne({_id : shop_type_id});
            if(!shoptype){
                return res.status(404).json({ message:"shoptype not found"});
            }
            
            const dataShopCategory = {
                name : name,
                place : place,
                batch : batch,
                shop_type_id : shop_type_id,
                product_image : `images/${req.file.filename}`
            }
    
            const shopcategory = await ShopCategory.create(dataShopCategory);
    
            res.status(201).json({ message : "Data created", shopcategory});
        }catch(error){
            console.log(error);
            return res.status(500).json({message : " Internal Server Error"});
        }
        

        
    },

    editShopCategory: async(req,res)=>{
        try{
            const body = req.body;
            
            console.log(req.body);
            const datashopcategory = await ShopCategory.findById(req.params.id);
            console.log(datashopcategory);
            console.log(req.file);
            if(req.file != undefined){
                await fs.unlink(path.join(`public/${datashopcategory.product_image}`));
                body.product_image = `images/${req.file.filename}`
            }
            const shopcategory = await ShopCategory.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(shopcategory);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailShopCategory: async(req,res)=>{
        try{
            const data = await ShopCategory.findById(req.params.id);
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

    readShopCategory: async(res)=>{
        try{
            const data = await ShopCategory.find();
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

    deleteShopCategory: async(req,res)=>{
        try{
            const data = await ShopCategory.findById(req.params.id);
            await fs.unlink(path.join(`public/${data.product_image}`))
            const shopcategory = await ShopCategory.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}