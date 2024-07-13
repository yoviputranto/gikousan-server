const Transaction = require('../../models/Transaction');
const Admin = require('../../models/Admin');
const PaymentMethod = require('../../models/PaymentMethod');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');

const validationRules = {
    is_in: 'required|boolean',
    issued_at: 'date',
    payment_method_id:'required',
    customer_id:'required',
    admin_id:'required'
};
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
            
            const dataTransaction = {
                is_in : is_in,
                issued_at : issued_at,
                admin_id : admin_id,
                payment_method_id : payment_method_id,
                customer_id : customer_id
            }
            const validation = new Validator(dataTransaction,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const admin = await Admin.findOne({_id : admin_id});
            if(!admin){
                return res.status(404).json({ success: false, message:"Admin not found"});
            }

            const paymentmethod = await PaymentMethod.findById(payment_method_id);
            if(!paymentmethod){
                return res.status(404).json({success: false, message:"Payment Method not found"});
            }

            const customer = await Customer.findById(customer_id);
            if(!customer){
                return res.status(404).json({success: false, message:"Customer not found"});
            }
    
            const data = await Transaction.create(dataTransaction);
    
            res.status(201).json({ success: true, message : "Data created", data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message : " Internal Server Error"});
        }
        

        
    },

    editTransaction: async(req,res)=>{
        try{
            const{
                is_in,
                issued_at,
                admin_id,
                payment_method_id,
                customer_id
            } = req.body;
            
            const transaction = {
                is_in : is_in,
                issued_at : issued_at,
                admin_id : admin_id,
                payment_method_id : payment_method_id,
                customer_id : customer_id
            }
            const validation = new Validator(transaction,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const dataTransaction = await Transaction.findById(req.params.id);
            if(!dataTransaction){
                return res.status(404).json({success: false, message:"Transaction not found"});
            }
            const admin = await Admin.findOne({_id : admin_id});
            if(!admin){
                return res.status(404).json({ success: false, message:"Admin not found"});
            }

            const paymentmethod = await PaymentMethod.findById(payment_method_id);
            if(!paymentmethod){
                return res.status(404).json({success: false, message:"Payment Method not found"});
            }

            const customer = await Customer.findById(customer_id);
            if(!customer){
                return res.status(404).json({success: false, message:"Customer not found"});
            }
            
            console.log(dataTransaction);
            const data = await Transaction.findByIdAndUpdate({_id:req.params.id},transaction,{new:true});
            return res.status(200).json({success: true, data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message: "Internal Server Error"});
        }
        
    },

    readDetailTransaction: async(req,res)=>{
        try{
            const data = await Transaction.findById(req.params.id);
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

    readTransaction: async(req,res)=>{
        try{
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const data = await Transaction.find()
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await Transaction.countDocuments();
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

    deleteTransaction: async(req,res)=>{
        try{
            // const data = await Transaction.findById(req.params.id);
            const transaction = await Transaction.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    }
}