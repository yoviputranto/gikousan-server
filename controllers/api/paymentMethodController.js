const PaymentMethod = require('../../models/PaymentMethod');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    createPaymentMethod: async(req,res)=>{
        try{
            const{
                name,
                description,
                is_active
            } = req.body;
            
            if(name == null || shop_type_id == null){
                return res.status(404).json({message:"Please fill all field"});
            }
            
            const dataPaymentMethod = {
                name : name,
                description : description,
                is_active : is_active,
                icon : `images/${req.file.filename}`
            }
    
            const PaymentMethod = await PaymentMethod.create(dataPaymentMethod);
    
            res.status(201).json({ message : "Data created", PaymentMethod});
        }catch(error){
            console.log(error);
            return res.status(500).json({message : " Internal Server Error"});
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
            const PaymentMethod = await PaymentMethod.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(PaymentMethod);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailPaymentMethod: async(req,res)=>{
        try{
            const data = await PaymentMethod.findById(req.params.id);
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

    readPaymentMethod: async(res)=>{
        try{
            const data = await PaymentMethod.find();
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

    deletePaymentMethod: async(req,res)=>{
        try{
            const data = await PaymentMethod.findById(req.params.id);
            await fs.unlink(path.join(`public/${data.icon}`))
            const PaymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}