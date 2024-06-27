const ShopType = require('../../models/ShopType');
const Validator = require('validatorjs');

const validationRules = {
    name: 'required|string',
    description: 'string'
};

module.exports={
    createShopType: async(req, res)=>{
        try {
            const validation = new Validator(req.body,validationRules);
            if(validation.fails()){
                return res.status(400).json({success:false, message:validation.errors.all()});
            }
            const{
                name,
                description,
            } = req.body;
    
            // if(name == null){
            //     res.status(404).json({message:"Please fill all field"});
            // }
            
            const data= await ShopType.create({
                name,
                description
            });
    
            res.status(201).json({ success:true, message : "Data created", data});
        } catch (error) {
            res.status(500).json({success:false, message:error})
        }
        

    },

    editShopType: async(req,res)=>{
        try{
            const validation = new Validator(req.body,validationRules);
            if(validation.fails()){
                return res.status(400).json({success:false, message:validation.errors.all()});
            }
            const body = req.body;
            
            const data = await ShopType.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json({success: true, message:"data updated",data});
        }catch(error){
            console.log(error);
            return res.status(500).json({success:false,message: "Internal Server Error"});
        }
        
    },

    readDetailShopType: async(req,res)=>{
        try{
            const data = await ShopType.findById(req.params.id);
            console.log(data);
            if(!data){
                return res.status(404).json({success: false, message:"Data not found"});
            }
            return res.status(200).json({success: true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false, message:"Internal Server Error"});
        }
    },

    readShopType: async(req, res)=>{
        try{
            const data = await ShopType.find();
            console.log(data);
            if(!data){
                return res.status(404).json({succes:false, message:"Data not found"});
            }
            return res.status(200).json({success:true,data});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false, message:"Internal Server Error"});
        }
    },

    deleteShopType: async(req,res)=>{
        try{
            const shoptype = await ShopType.findByIdAndDelete(req.params.id);
            res.status(200).json({success: true, message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({success: false, message:"Internal Server Error"});
        }
    }
}