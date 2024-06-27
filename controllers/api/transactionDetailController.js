const TransactionDetail = require('../../models/TransactionDetail');
const Transaction = require('../../models/Transaction');
const Shopping = require('../../models/Shopping');
const fs = require('fs-extra');
const path = require('path');

module.exports= {
    createTransactionDetail: async(req,res)=>{
        try{
            const{
                paid_amount,
                shop_name,
                description,
                transaction_id,
                shopping_id
            } = req.body;
            
            if(paid_amount == null || description == null){
                return res.status(404).json({message:"Please fill all field"});
            }

            const transaction = await Transaction.findOne({_id : transaction_id});
            if(!transaction){
                return res.status(404).json({ message:"Transaction not found"});
            }

            const customer = await Shopping.findById(shopping_id);
            if(!customer){
                return res.status(404).json({message:"Shopping not found"});
            }
            
            const dataTransactionDetail = {
                paid_amount : paid_amount,
                shop_name : shop_name,
                batch : batch,
                description : description,
                transaction_id : transaction_id,
                shopping_id : shopping_id
            }
    
            const transactionDetail = await TransactionDetail.create(dataTransactionDetail);
    
            res.status(201).json({ message : "Data created", transactionDetail});
        }catch(error){
            console.log(error);
            return res.status(500).json({message : " Internal Server Error"});
        }
        

        
    },

    editTransactionDetail: async(req,res)=>{
        try{
            const body = req.body;
            
            console.log(req.body);
            const dataTransactionDetail = await TransactionDetail.findById(req.params.id);
            console.log(dataTransactionDetail);
            const TransactionDetail = await TransactionDetail.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(TransactionDetail);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailTransactionDetail: async(req,res)=>{
        try{
            const data = await TransactionDetail.findById(req.params.id);
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

    readTransactionDetail: async(res)=>{
        try{
            const data = await TransactionDetail.find();
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

    deleteTransactionDetail: async(req,res)=>{
        try{
            const data = await TransactionDetail.findById(req.params.id);
            const transactionDetail = await TransactionDetail.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}