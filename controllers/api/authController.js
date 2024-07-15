const Admin = require('../../models/Admin');

module.exports={
    login: async(req,res)=>{
        try {
            const user = await Admin.findByCredentials(req.body.email,req.body.password)
            const token = await user.generateAuthToken()
            console.log(user);
            res.status(200).send({success:true,token:token,username: user.name, id:user.id})
        }catch(e){
            res.status(400).send({success:false,message:e})
        }
    },
    logout: async(req, res)=>{
        try{
            req.user.tokens = []
            await req.user.save();
            res.status(200).send({success:true, message:"Logout successful"})
        }catch(e){
            res.status(500).send({success:false,message:e})
        }
    }
}

