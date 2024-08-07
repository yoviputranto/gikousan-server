const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    created_at:{
        type: Date,
    }
})

adminSchema.methods.toJSON = function (){
    const admin = this.toObject()
    delete admin.password
    delete admin.tokens
    return admin;
}

adminSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},'gikousan')
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}
adminSchema.statics.findByCredentials = async (email,password) =>{
    try{
        const admin = await Admin.findOne({email});
        if(!admin)
        throw new Error()
        const isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch)
            throw new Error()
        return admin;
    }catch(e){
        return "Unable to login"
    }
}

adminSchema.pre('save',async function(next){
    const admin = this
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password,8);
    }
    next();
})
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;