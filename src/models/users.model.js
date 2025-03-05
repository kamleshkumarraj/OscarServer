import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required  :[true , "please enter firstName"],
        minlength : [3 , "firstName must be at least 3 characters"]
    },
    lastName : {
        type : String,
        required :   [true , "please enter lastName"],
        minlength : [3 , "lastName must be at least 3 characters"]
    },
    username : {
        type  :String,
        required : [true , "please enter username"],
        unique : [true , "username must be unique"],
        minlength : [3 , "username must be at least 3 characters"]
    },
    email : {
        type: String,
        required: true,
        unique: [true,"email must be unique"],
        match: /^\S+@\S+\.\S+$/,
        lowercase: true, 
        
    },
    password : {
        type : String,
        minlength : [8 , "password must be at least 8 characters"],
        required : [true , "password must be required"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
            required : ['true' , "please enter public_id"],
        },
        url : {
            type : String,
            required : ['true' , "please enter url"],
        }
    },
    roles : {
        type : String,
        default : 'user'
    },
    resetPasswordToken : String,
    resetPasswordExpiry : Date,
    userDeleteToken : String,
    userDeleteExpiry : Date
},{timestamps : true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

})
userSchema.methods.comparePassword = async function (password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch
}

userSchema.methods.generateJWTToken = async function(){
    const token = jwt.sign({id : this._id}, process.env.JWT_SECRET);
    return token
}

userSchema.methods.generateResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpiry = Date.now() + 5*60*1000;
    return resetToken
}

userSchema.methods.generateUserDeleteToken = function(){
    const resetToken =  crypto.randomBytes(20).toString("hex");
    this.userDeleteToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.userDeleteExpiry = Date.now() + 5*60*1000;
    return resetToken
}
export const Users = mongoose.model("user",userSchema);
