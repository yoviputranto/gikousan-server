const Transaction = require('../../models/Transaction');
const Admin = require('../../models/Admin');
const PaymentMethod = require('../../models/PaymentMethod');
const Customer = require('../../models/Customer');
const TransactionDetail = require('../../models/TransactionDetail')
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');
const mongoose = require("mongoose");

const validationRulesInTransaction = {
    is_in: 'required|boolean',
    issued_at: 'date',
    payment_method_id:'required',
    customer_id:'required',
    admin_id:'required'
};
const validationRulesOutTransaction = {
    is_in: 'required|boolean',
    issued_at: 'date',
    payment_method_id:'required',
    admin_id:'required'
};
const validationRulesTransactionDetail = {
    paid_amount: 'required|integer',
    shop_name: 'string',
    description:'string',
    transaction_id:'required',
};
module.exports= {
    createTransaction: async(req,res)=>{
        try{
            
            const{
                is_in,
                issued_at,
                admin_id,
                payment_method_id,
                customer_id,
                transaction_details
            } = req.body;
            
            if(is_in == true){
                const dataTransaction = {
                    is_in : is_in,
                    issued_at : issued_at,
                    admin_id : admin_id,
                    payment_method_id : payment_method_id,
                    customer_id : customer_id,
                    created_at: new Date()
                }
                console.log(dataTransaction)
                const validation = new Validator(dataTransaction,validationRulesInTransaction);
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
                for(i=0; i<transaction_details.length;i++){
                    let dataTransactionDetail={
                        paid_amount:0,
                        shop_name:transaction_details[i].product_name,
                        description:null,
                        transaction_id:data.id,
                        shopping_id:transaction_details[i].shopping_id,
                        created_at: new Date()
                    }
                    let validationDetail = new Validator(dataTransactionDetail,validationRulesTransactionDetail);
                    if (validationDetail.fails()) {
                        return res.status(400).json({success : false, message:validationDetail.errors.all()});
                    }
                    let transactiondetail = await TransactionDetail.create(dataTransactionDetail);
                    console.log(transactiondetail)
                }
                res.status(201).json({ success: true, message : "Data created", data});
            }else{
                const dataTransaction = {
                    is_in : is_in,
                    issued_at : issued_at,
                    admin_id : admin_id,
                    payment_method_id : payment_method_id,
                    created_at: new Date()
                }
                console.log(dataTransaction)
                const validation = new Validator(dataTransaction,validationRulesOutTransaction);
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
        
                const data = await Transaction.create(dataTransaction);
                let dataTransactionDetail={
                    paid_amount:req.body.price * -1,
                    shop_name:req.body.name,
                    description:null,
                    transaction_id:data.id,
                    created_at: new Date()
                }
                let validationDetail = new Validator(dataTransactionDetail,validationRulesTransactionDetail);
                if (validationDetail.fails()) {
                    return res.status(400).json({success : false, message:validationDetail.errors.all()});
                }
                let transactiondetail = await TransactionDetail.create(dataTransactionDetail);
                console.log(transactiondetail)
                res.status(201).json({ success: true, message : "Data created", data});
            }
            
    
            
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
            
            if(is_in == true){
                const transaction = {
                    is_in : is_in,
                    issued_at : issued_at,
                    admin_id : admin_id,
                    payment_method_id : payment_method_id,
                    customer_id : customer_id
                }
                const validation = new Validator(transaction,validationRulesInTransaction);
                if (validation.fails()) {
                    return res.status(400).json({success : false, message:validation.errors.all()});
                }
                const customer = await Customer.findById(customer_id);
                if(!customer){
                    return res.status(404).json({success: false, message:"Customer not found"});
                }
            }else{
                const transaction = {
                    is_in : is_in,
                    issued_at : issued_at,
                    admin_id : admin_id,
                    payment_method_id : payment_method_id
                }
                const validation = new Validator(transaction,validationRulesOutTransaction);
                if (validation.fails()) {
                    return res.status(400).json({success : false, message:validation.errors.all()});
                }
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
                .limit(pageSize).sort({issued_at:-1});
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
    },

    getDataFinance: async(req,res)=>{
        try {
            console.log("test")
            const filter = {};
            let filterPaymentMethod = {};
            filter["transaction.payment_method_id"] = {$ne:null};
            filter["paymentmethod.is_active"] = {$eq:true};
            if(req.query.paymentMethod){
                const payment_method = new mongoose.Types.ObjectId(req.query.paymentMethod);
                filter["transaction.payment_method_id"] = payment_method;
                filterPaymentMethod._id = payment_method
            }
            if(req.query.startDate && req.query.endDate){
                filter["transaction.issued_at"] = {
                    $gte:new Date(req.query.startDate),
                    $lte:new Date(req.query.endDate)
                }
            }else if(req.query.startDate){
                filter["transaction.issued_at"] = {$gte:new Date(req.query.startDate)}
                
            }else if(req.query.endDate){
                filter["transaction.issued_at"] = {$lte:new Date(req.query.endDate)}
            }
            
            filterPaymentMethod.is_active = {$eq:true};
            filterPaymentMethod["transaction"] = {$exists:false};
            
            const paymentmethodWithoutTransaction = await PaymentMethod.aggregate([
                {
                    $lookup: {
                        from: "transactions", // events collection name
                        localField: "_id",
                        foreignField: "payment_method_id",
                        as: "transaction",
                      },
                },
                {
                    $lookup: {
                        from: "transactiondetails", // events collection name
                        localField: "transaction._id",
                        foreignField: "transaction_id",
                        as: "transactiondetail",
                      },
                },
                {
                    $unwind: {
                      path: '$transaction',
                      preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                      path: '$transactiondetail',
                      preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filterPaymentMethod
                },
                {
                    $group:{
                        "_id":"$_id",
                        name:{$first:"$name"},
                        total:{
                            $sum:"$transaction.transactiondetail.paid_amount"
                        }
                    }
                },
                {
                    $sort:{created_at:-1,name:1}
                }
            ])
            //console.log(test);
            let paymentmethodWithTransaction = await TransactionDetail.aggregate([
                {
                    $lookup: {
                      from: "transactions", // events collection name
                      localField: "transaction_id",
                      foreignField: "_id",
                      as: "transaction",
                    },
                },
                {
                    $lookup: {
                      from: "paymentmethods", // events collection name
                      localField: "transaction.payment_method_id",
                      foreignField: "_id",
                      as: "paymentmethod",
                    },
                },

                {
                    $unwind: {
                        path: '$transaction',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$paymentmethod',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filter
                },
                {
                    $group:{
                        "_id":"$paymentmethod._id",
                        name : {$first : "$paymentmethod.name"},
                        total : {$sum : "$paid_amount"},
                        
                    }
                },
                {
                    $sort:{created_at:-1,name:1}
                }
            ])
            paymentmethodWithTransaction = paymentmethodWithTransaction.concat(paymentmethodWithoutTransaction)
            console.log(paymentmethodWithTransaction)
            const totalamount = await TransactionDetail.aggregate([
                {
                    $lookup: {
                      from: "transactions", // events collection name
                      localField: "transaction_id",
                      foreignField: "_id",
                      as: "transaction",
                    },
                },
                {
                    $lookup: {
                      from: "paymentmethods", // events collection name
                      localField: "transaction.payment_method_id",
                      foreignField: "_id",
                      as: "paymentmethod",
                    },
                },
                {
                    $unwind: {
                        path: '$transaction',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$paymentmethod',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filter
                },
                {
                    $group:{
                        "_id":null,
                        total : {$sum : "$paid_amount"},
                        
                    }
                }
            ])
            console.log("total")
            console.log(totalamount)
            const transaction = await TransactionDetail.aggregate([
                {
                    $lookup: {
                      from: "transactions", // events collection name
                      localField: "transaction_id",
                      foreignField: "_id",
                      as: "transaction",
                    },
                },
                {
                    $lookup: {
                      from: "paymentmethods", // events collection name
                      localField: "transaction.payment_method_id",
                      foreignField: "_id",
                      as: "paymentmethod",
                    },
                },
                {
                    $lookup: {
                      from: "customers", // events collection name
                      localField: "transaction.customer_id",
                      foreignField: "_id",
                      as: "customer",
                    },
                },
                {
                    $unwind: {
                        path: '$transaction',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$paymentmethod',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:filter
                },
                {
                    $group:{
                        "_id":"$transaction_id",
                        description : {$first:{$cond:{
                            if:{$eq:["$transaction.is_in",true]},
                            then:{$concat:["Pembayaran dari ","$customer.name"]},
                            else:{$concat:["Pembelian ","$shop_name"]}}}},
                        total : {$sum : "$paid_amount"},
                        is_in : {$first : "$transaction.is_in"},
                        date : {$first : "$transaction.issued_at"},
                        payment_name : {$first:"$paymentmethod.name"}
                    }
                },
                {
                    $sort:{date:-1}
                }
            ])
            console.log(transaction)
            // console.log({
            //     success:true,
            //     data:{
            //         total_amount: totalamount[0].total,
            //         payment_method:paymentmethod[0],
            //         transaction:transaction[0]
            //     }
            // })
            return res.status(200).json({
                success:true,
                data:{
                    total_amount: totalamount.length > 0?totalamount[0].total:0,
                    payment_method:paymentmethodWithTransaction,
                    transaction:transaction
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false, message:error})
        }
    }


}