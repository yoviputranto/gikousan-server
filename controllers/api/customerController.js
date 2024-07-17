const Customer = require('../../models/Customer');
const Validator = require('validatorjs');

const validationRules = {
    name: 'required|string',
    phone: 'required|string',
    instagram: 'string'
};

module.exports = {
    createCustomer: async(req, res)=>{
        try {
            const validation = new Validator(req.body,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const{
                name,
                phone,
                instagram,
            } = req.body;
    
            if(name == null){
                res.status(404).json({message:"Please fill all field"});
            }
            
            const data= await Customer.create({
                name,
                phone,
                instagram
            });
    
            res.status(201).json({success:true, message : "Data created", data});
        } catch (error) {
            res.status(500).json({success:false, message : "Internal Server Error"})
        }
        

    },

    editCustomer: async(req,res)=>{
        try{
            const validation = new Validator(req.body,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const body = req.body;
            const data = await Customer.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json({success:true,message:"data updated",data});
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailCustomer: async(req,res)=>{
        try{
            const data = await Customer.findById(req.params.id);
            console.log(data);
            // if(!data){
            //     return res.status(404).json({success: false, message:"Data not found"});
            // }
            return res.status(200).json({success: true, data});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    },

    readCustomer: async(req,res)=>{
        try{
            console.log(req.query);
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const search = req.query.search;
            let filter = {}; 
            if(search){
                filter.name = {$regex : '.*' + search + '.*', $options:'i'}
            }
            const data = await Customer.find(filter)
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await Customer.find(filter).countDocuments();
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

    deleteCustomer: async(req,res)=>{
        try{
            const data = await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json({success:true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false, message:"Internal Server Error"});
        }
    }
}