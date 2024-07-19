const TransactionDetail = require('../../models/TransactionDetail');
const Transaction = require('../../models/Transaction');
const Shopping = require('../../models/Shopping');
const Customer = require('../../models/Customer');
const fs = require('fs-extra');
const path = require('path');
const Validator = require('validatorjs');
const mongoose = require("mongoose");

const validationRules = {
    paid_amount: 'required|integer',
    shop_name: 'string',
    description:'string',
    transaction_id:'required',
};


var transactionDetailController= {
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
    },

    readTransactionDetailByTransaction: async(req,res)=>{
        try {
            const transaction_id = new mongoose.Types.ObjectId(req.params.id);
            
            const data = await TransactionDetail.aggregate([
                {
                    $lookup: {
                      from: "shoppings", // events collection name
                      localField: "shopping_id",
                      foreignField: "_id",
                      as: "shopping",
                    },
                },
                {
                    $lookup: {
                      from: "shopcategories", // events collection name
                      localField: "shopping.shop_category_id",
                      foreignField: "_id",
                      as: "shopcategory",
                    },
                },
                {
                    $lookup: {
                      from: "shoptypes", // events collection name
                      localField: "shopcategory.shop_type_id",
                      foreignField: "_id",
                      as: "shoptype",
                    },
                },

                {
                    $unwind: {
                        path: '$shopping',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$shopcategory',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$shoptype',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match:{
                        transaction_id : transaction_id
                    }
                },
                {
                    $group:{
                        "_id":"$shopcategory.shop_type_id",
                        name : {$first : "$shoptype.name"},
                        data: {
                            $push: {
                              _id : "$_id",
                              shop_name: "$shop_name",
                              description: "$description",
                              paid_amount : "$paid_amount"
                            }
                        },
                        
                    }
                }
            ])
            return res.status(200).json({
                success:true, 
                data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },
    fillAmountTransactionDetail: async(req,res)=>{
        try{
            const{
                transaction_id,
                data
            } = req.body;
            console.log(data);
            for(i=0;i < data.length;i++){
                console.log(data[i].id)
                const dataTransactionDetail = await TransactionDetail.findById(data[i].id);
                if(!dataTransactionDetail){
                    return res.status(404).json({success : false, message:"Transaction Detail not found"});
                }
                const transactiondetail = {
                    paid_amount : data[i].paid_amount,
                    shop_name : dataTransactionDetail.shop_name,
                    description : dataTransactionDetail.description,
                    transaction_id : transaction_id,
                    shopping_id : dataTransactionDetail.shopping_id
                }
                console.log(transactiondetail);
                const validation = new Validator(transactiondetail,validationRules);
                if (validation.fails()) {
                    return res.status(400).json({success : false, message:validation.errors.all()});
                }
                let checkAmountResult = transactionDetailController.checkAmount(dataTransactionDetail.shopping_id,data[i].paid_amount)
                console.log(checkAmountResult)
                if(!checkAmountResult.isUpdate){
                    return res.status(404).json({success : false, message: "Barang " + dataTransactionDetail.shop_name + " " + checkAmountResult.message})
                }
            }
            
            
            
            // const transaction = await Transaction.findOne({_id : transaction_id});
            // if(!transaction){
            //     return res.status(404).json({ success : false, message:"Transaction not found"});
            // }

            // const shopping = await Shopping.findById(shopping_id);
            // if(!shopping){
            //     return res.status(404).json({success : false, message:"Shopping not found"});
            // }
            
            //const data = await TransactionDetail.findByIdAndUpdate({_id:req.params.id},transactiondetail,{new:true});
            return res.status(200).json({success: true, message:"payment successful"});
        }catch(error){
            console.log(error);
            return res.status(500).json({success: false, message: "Internal Server Error"});
        }
        
    },

    checkAmount:  function(shopping_id,paid_amount){
        const shopping = Shopping.findById(shopping_id);
        if(!shopping){
            return res.status(404).json({success : false, message:"Shopping not found"});
        }
        let isUpdate = false;
        let message = "";
        let dataShopping = {};
        console.log(shopping.bill);
        if(shopping.status == "Belum Lunas"){
            let currentAmount = 0;
            
            if(paid_amount < shopping.bill){
                currentAmount = shopping.bill - paid_amount;
                dataShopping.bill = currentAmount;
                isUpdate = true;
                message = "Lunas Sebagian"
            }else if(paid_amount == shopping.bill){
                dataShopping.status = "Lunas"
                dataShopping.bill = currentAmount;
                isUpdate = true;
                message = "Lunas"
            }else{
                message = "Nominal yang dibayar melebihi jumlah tagihan"
            }
        }else{
            message = "Tagihan sudah lunas";
        }
        return{
            isUpdate : isUpdate,
            message : message,
            data : dataShopping
        }
    },
}

module.exports = transactionDetailController;