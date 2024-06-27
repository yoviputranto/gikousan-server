const Admin = require('../../models/Admin');

module.exports={
    login: async(req,res)=>{
        try {
            const user = await Admin.findByCredentials(req.body.email,req.body.password)
            const token = await user.generateAuthToken()
            res.status(200).send({user,token})
        }catch(e){
            res.status(400).send(e)
        }
    },
    logout: async(req, res)=>{
        try{
            req.user.tokens = []
            await req.user.save();
            res.status(200).send(req.user)
        }catch(e){
            res.status(500).send()
        }
    }
}

