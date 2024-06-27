const ShopType = require('../models/ShopType');
const ShopCategory = require('../models/ShopCategory');
const Shopping = require('../models/Shopping');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const TransactionDetail = require('../models/TransactionDetail');
const PaymentMethod = require('../models/PaymentMethod');
module.exports = {
    testConnection: (req,res)=>{
        const message = 'Test Connection';
        res.status(200).json({message})
    },

    createAdmin: async(req, res)=>{
        const{
            name,
            email,
            password
        } = req.body;

        console.log(req.body);
        if( name === undefined || email === undefined || password === undefined){
            res.status(404).json({ message:"Please fill all field!"});
        }
        const admin = await Admin.create({
            name,
            email,
            password
        });
        res.status(201).json({message:"success", admin});
    },

    createShopType: async(req,res)=>{
        const{
            name,
            description
        } = req.body;

        if(name === undefined || description === undefined){
            res.status(404).json({message:"Please fill all field!"});
        }
        const shoptype = await ShopType.create({
            name,
            description
        });
        res.status(201).json({message:"data created", shoptype});

    },

    createCustomer: async(req,res)=>{
        const{
            name,
            phone,
            instagram
        } = req.body;

        if(name === undefined || phone === undefined){
            res.status(404).json({message:"Please fill all field!"});
        }
        const customer = await Customer.create({
            name,
            phone,
            instagram
        });
        res.status(201).json({message:"data created", customer});
        
    },

    createPaymentMethod: async(req,res)=>{
        const{
            name,
            description,
            icon,
            is_active
        } = req.body;

        if(name === undefined || description === undefined || icon === undefined || is_active === undefined){
            res.status(404).json({message:"Please fill all field!"});
        }
        const paymentmethod = await PaymentMethod.create({
            name,
            description,
            icon,
            is_active
        });
        res.status(201).json({message:"data created", paymentmethod});
        
    },

    create: async(req,res)=>{
        const{
            name,
            description,
            icon,
            is_active
        } = req.body;

        if(name === undefined || description === undefined || icon === undefined || is_active === undefined){
            res.status(404).json({message:"Please fill all field!"});
        }
        const paymentmethod = await PaymentMethod.create({
            name,
            description,
            icon,
            is_active
        });
        res.status(201).json({message:"data created", paymentmethod});
        
    },
}