const PaymentMethod = require('../../models/PaymentMethod');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');

const validationRules = {
    name: 'required|string',
    description: 'required|string',
    is_active: 'boolean',
    icon: 'required|string'
};

module.exports = {
    createPaymentMethod: async(req,res)=>{
        try{
            const{
                name,
                description,
                is_active
            } = req.body;
            if(req.file == undefined){
                return res.status(400).json({success:false,message:"image field is required"})
            }
            console.log(req.file);
            const dataPaymentMethod = {
                name : name,
                description : description,
                is_active : is_active,
                icon : `images/${req.file.filename}`
            }
            const validation = new Validator(dataPaymentMethod,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
    
            const data = await PaymentMethod.create(dataPaymentMethod);
    
            res.status(201).json({ success:true, message : "Data created", data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success : false, message : " Internal Server Error"});
        }
        

        
    },

    editPaymentMethod: async(req,res)=>{
        try{
            const body = req.body;
            
            console.log(req.body);
            const dataPaymentMethod = await PaymentMethod.findById(req.params.id);
            console.log(dataPaymentMethod);
            console.log(req.file);
            if(req.file != undefined){
                await fs.unlink(path.join(`public/${dataPaymentMethod.icon}`));
                body.icon = `images/${req.file.filename}`
            }
            const data = await PaymentMethod.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false, message: "Internal Server Error"});
        }
        
    },

    readDetailPaymentMethod: async(req,res)=>{
        try{
            const data = await PaymentMethod.findById(req.params.id);
            console.log(data);
            if(!data){
                return res.status(404).json({success:false,message:"Data not found"});
            }
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false, message:"Internal Server Error"});
        }
    },

    readPaymentMethod: async(req,res)=>{
        try{
            const data = await PaymentMethod.find();
            console.log(data);
            if(data.length == 0){
                return res.status(404).json({success: false, message:"Data not found"});
            }
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    deletePaymentMethod: async(req,res)=>{
        try{
            const data = await PaymentMethod.findById(req.params.id);
            await fs.unlink(path.join(`public/${data.icon}`))
            const dataPaymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    }
}