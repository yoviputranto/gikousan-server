const ShopCategory = require('../../models/ShopCategory');
const ShopType = require('../../models/ShopType');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');

const validationRules = {
    name: 'required|string',
    place: 'string',
    batch: 'integer',
    shop_type_id: 'required',
    date:'date'
};

module.exports= {
    createShopCategory: async(req,res)=>{
        try{
            const{
                name,
                place,
                batch,
                shop_type_id,
                date
            } = req.body;
            
            // const shoptype = await ShopType.findOne({_id : shop_type_id});
            // if(!shoptype){
            //     return res.status(404).json({ message:"shoptype not found"});
            // }
            
            const dataShopCategory = {
                name : name,
                place : place,
                batch : batch,
                shop_type_id : shop_type_id,
                date : date
                // product_image : `images/${req.file.filename}`
            }
            console.log(dataShopCategory);
            const validation = new Validator(dataShopCategory,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            if(req.file != undefined){
                dataShopCategory.product_image = `images/${req.file.filename}`;
            }
            
            console.log(dataShopCategory);
            const data = await ShopCategory.create(dataShopCategory);
    
            res.status(201).json({ success : true, message : "Data created", data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success : false, message : " Internal Server Error"});
        }
        
    },

    editShopCategory: async(req,res)=>{
        try{
            const{
                name,
                place,
                batch,
                shop_type_id,
                date
            } = req.body;
            
            console.log(req.body);
            
            const shopcategory = {
                name : name,
                place : place,
                batch : batch,
                shop_type_id : shop_type_id,
                date : date
                // product_image : `images/${req.file.filename}`
            }
            const validation = new Validator(shopcategory,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const shoptype = await ShopType.findOne({_id : shop_type_id});
            if(!shoptype){
                return res.status(404).json({success:false, message:"shoptype not found"});
            }
            const dataShopCategory = await ShopCategory.findById(req.params.id);
            if(!dataShopCategory){
                return res.status(404).json({success:false, message:"shop category not found"});
            }
            let product_image = '';
            if(req.file != undefined && dataShopCategory.product_image != null){
                await fs.unlink(path.join(`public/${dataShopCategory.product_image}`));
                product_image = `images/${req.file.filename}`
                shopcategory.product_image = product_image;
            }else if(dataShopCategory.product_image != null){
                product_image = dataShopCategory.product_image
                shopcategory.product_image = product_image;
            }
            
            
            
            const data = await ShopCategory.findByIdAndUpdate({_id:req.params.id},shopcategory,{new:true});
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false, message: "Internal Server Error"});
        }
        
    },

    readDetailShopCategory: async(req,res)=>{
        try{
            const data = await ShopCategory.findById(req.params.id);
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

    readShopCategory: async(req,res)=>{
        try{
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
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    deleteShopCategory: async(req,res)=>{
        try{
            const data = await ShopCategory.findById(req.params.id);
            if(data.product_image){
                await fs.unlink(path.join(`public/${data.product_image}`))
            }
            
            const shopcategory = await ShopCategory.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    },
    toTitleCase : (str)=>{
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    }
}