const Admin = require('../../models/Admin');
const Validator = require('validatorjs');

const validationRules = {
    name: 'required|string',
    email: 'required|string|email',
    password: 'required|string|min:8'
};

const validationRulesUpdate = {
    name: 'required|string',
    email: 'required|string|email'
};

module.exports={
    createAdmin: async(req, res)=>{
        try {
            const validation = new Validator(req.body,validationRules);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const{
                name,
                email,
                password
            } = req.body;
            if(name == null){
                res.status(404).json({message:"Please fill all field"});
            }
            
            const data= await Admin.create({
                name,
                email,
                password
            });

            res.status(201).json({success:true, message : "Data created", data});
        } catch (error) {
            res.status(500).json({success:false, message : "Internal Server Error"})
        }
        

    },

    editAdmin: async(req,res)=>{
        try{
            const validation = new Validator(req.body,validationRulesUpdate);
            if (validation.fails()) {
                return res.status(400).json({success : false, message:validation.errors.all()});
            }
            const body = req.body;
            const data = await Admin.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json({success : true, message:"data updated",data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false, message: "Internal Server Error"});
        }
        
    },

    readDetailAdmin: async(req,res)=>{
        try{
            const data = await Admin.findById(req.params.id);
            console.log(data);
            // if(!data){
            //     return res.status(404).json({success:false, message:"Data not found"});
            // }
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    readAdmin: async(req, res)=>{
        try{
            // const data = await Admin.find();
            //console.log(data);
            // if(data.length == 0){
            //     return res.status(404).json({success:false, message:"Data not found"});
            // }
            const page = parseInt(req.query.page,10);
            const pageSize = parseInt(req.query.pageSize,10);
            const data = await Admin.find()
                .skip((page > 0 ? page - 1 : page)*pageSize)
                .limit(pageSize);
            const count = await Admin.countDocuments();
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
            // return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"});
        }
    },

    deleteAdmin: async(req,res)=>{
        try{
            const admin = await Admin.findByIdAndDelete(req.params.id);
            res.status(200).json({success:true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false, message:"Internal Server Error"});
        }
    },

}