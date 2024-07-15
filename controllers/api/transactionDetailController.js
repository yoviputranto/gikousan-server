const TransactionDetail = require('../../models/TransactionDetail');
const Transaction = require('../../models/Transaction');
const Shopping = require('../../models/Shopping');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');

const validationRules = {
    paid_amount: 'required|integer',
    shop_name: 'string',
    description:'string',
    transaction_id:'required',
};

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
            
            const dataTransactionDetail = {
                paid_amount : paid_amount,
                shop_name : shop_name,
                description : description,
                transaction_id : transaction_id,
                shopping_id : shopping_id
            }
            const validation = new Validator(dataTransactionDetail,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const transaction = await Transaction.findOne({_id : transaction_id});
            if(!transaction){
                return res.status(404).json({ success : false, message:"Transaction not found"});
            }

            const shopping = await Shopping.findById(shopping_id);
            if(!shopping){
                return res.status(404).json({success : false, message:"Shopping not found"});
            }
            
            const transactionType = transaction.is_in;
            if(transactionType){
                const totalAmount = await Shopping.find({customer_id:transaction.customer_id},{status:"Belum Lunas"}).select('')

            }else{

            }
            
            const data = await TransactionDetail.create(dataTransactionDetail);
    
            res.status(201).json({ success : true, message : "Data created", data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success : false, message : " Internal Server Error"});
        }
        

        
    },

    editTransactionDetail: async(req,res)=>{
        try{
            const{
                paid_amount,
                shop_name,
                description,
                transaction_id,
                shopping_id
            } = req.body;
            
            const transactiondetail = {
                paid_amount : paid_amount,
                shop_name : shop_name,
                description : description,
                transaction_id : transaction_id,
                shopping_id : shopping_id
            }
            const validation = new Validator(transactiondetail,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const dataTransactionDetail = await TransactionDetail.findById(req.params.id);
            if(!dataTransactionDetail){
                return res.status(404).json({success : false, message:"Transaction Detail not found"});
            }
            const transaction = await Transaction.findOne({_id : transaction_id});
            if(!transaction){
                return res.status(404).json({ success : false, message:"Transaction not found"});
            }

            const shopping = await Shopping.findById(shopping_id);
            if(!shopping){
                return res.status(404).json({success : false, message:"Shopping not found"});
            }
            
            const data = await TransactionDetail.findByIdAndUpdate({_id:req.params.id},transactiondetail,{new:true});
            return res.status(200).json({success: true, data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message: "Internal Server Error"});
        }
        
    },

    readDetailTransactionDetail: async(req,res)=>{
        try{
            const data = await TransactionDetail.findById(req.params.id);
            console.log(data);
            // if(!data){
            //     return res.status(404).json({message:"Data not found"});
            // }
            return res.status(200).json({success: true, data});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    },

    readTransactionDetail: async(req,res)=>{
        try{
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            let transactionId = '';
            if(req.query.transaction){
                transactionId = req.query.transaction;
            }
            const filterTransaction = transactionId ? {transaction_id : transactionId}: null
            const data = await TransactionDetail.find(filterTransaction)
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await TransactionDetail.find(filterTransaction).countDocuments();
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
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    },

    deleteTransactionDetail: async(req,res)=>{
        try{
            // const data = await TransactionDetail.findById(req.params.id);
            const transactionDetail = await TransactionDetail.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    }
}