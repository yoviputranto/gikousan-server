const Transaction = require('../../models/Transaction');
const Admin = require('../../models/Admin');
const PaymentMethod = require('../../models/PaymentMethod');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');

module.exports= {
    createTransaction: async(req,res)=>{
        try{
            const{
                is_in,
                issued_at,
                admin_id,
                payment_method_id,
                customer_id
            } = req.body;
            
            if(is_in == null || admin_id == null){
                return res.status(404).json({message:"Please fill all field"});
            }

            const admin = await Admin.findOne({_id : admin_id});
            if(!admin){
                return res.status(404).json({ message:"Admin not found"});
            }

            const paymentmethod = await PaymentMethod.findById(payment_method_id);
            if(!paymentmethod){
                return res.status(404).json({message:"Payment Method not found"});
            }

            const customer = await Customer.findById(customer_id);
            if(!customer){
                return res.status(404).json({message:"Customer not found"});
            }
            
            const dataTransaction = {
                is_in : is_in,
                issued_at : issued_at,
                batch : batch,
                admin_id : admin_id,
                payment_method_id : payment_method_id,
                customer_id : customer_id
            }
    
            const transaction = await Transaction.create(dataTransaction);
    
            res.status(201).json({ message : "Data created", transaction});
        }catch(error){
            console.log(error);
            return res.status(500).json({message : " Internal Server Error"});
        }
        

        
    },

    editTransaction: async(req,res)=>{
        try{
            const body = req.body;
            
            console.log(req.body);
            const dataTransaction = await Transaction.findById(req.params.id);
            console.log(dataTransaction);
            const Transaction = await Transaction.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(Transaction);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailTransaction: async(req,res)=>{
        try{
            const data = await Transaction.findById(req.params.id);
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

    readTransaction: async(res)=>{
        try{
            const data = await Transaction.find();
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

    deleteTransaction: async(req,res)=>{
        try{
            const data = await Transaction.findById(req.params.id);
            const transaction = await Transaction.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}