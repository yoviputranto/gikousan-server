const Customer = require('../../models/Customer');

module.exports = {
    createCustomer: async(req, res)=>{
        const{
            name,
            phone,
            instagram,
        } = req.body;

        if(name == null){
            res.status(404).json({message:"Please fill all field"});
        }
        
        const Customer= await Customer.create({
            name,
            phone,
            instagram
        });

        res.status(201).json({ message : "Data created", Customer});

    },

    editCustomer: async(req,res)=>{
        try{
            const body = req.body;
            
            const Customer = await Customer.findByIdAndUpdate({_id:req.params.id},body,{new:true});
            return res.status(200).json(Customer);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
        
    },

    readDetailCustomer: async(req,res)=>{
        try{
            const data = await Customer.findById(req.params.id);
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

    readCustomer: async(res)=>{
        try{
            const data = await Customer.find();
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

    deleteCustomer: async(req,res)=>{
        try{
            const Customer = await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Data deleted"});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
    }
}