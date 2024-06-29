const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const auth = async(req,res,next) =>{
    try{
        console.log(req.header('Authorization'))
        
        if(req.header('Authorization') == undefined){
            return res.status(400).send({success:false, message:"Invalid token"})
        }
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = await jwt.verify(token,'gikousan')
        const user = await Admin.findOne({_id:decode._id,'tokens.token':token})
        if(!user)
        throw new Error()
        req.token = token
        req.user = user
        next();
    }catch(e){
        console.log(e);
        res.status(404).send({success:false, message:e.message})
    }
}

module.exports = auth