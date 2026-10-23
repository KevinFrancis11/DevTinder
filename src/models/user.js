const mongoose = require('mongoose');
const {isEmail} = require('validator');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const {Schema} = mongoose;

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        maxlength: 54,
    },
    secondName : {
        type: String,
        maxlength: 54,  
    },
    emailId : {
        type : String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: "Enter a valied email address!!",
        },
        //validate(value){
            //if(!validator.isEmail(value)){
                //throw new Error("Email is not valid")
            
            // }  
        //}
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password!!!");
            }
        }
    },
    age : {
        type: Number,
        min: 18,
    },
    gender : {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is an invalid gender type`,
        },
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error("Gender data is not valied!!!");
        //     }
        // },
    },
    photoURL : {
        type: String,
        default: "https://hostalitecloud.com/crb/wp-content/uploads/2025/10/dummy-user-male.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valied photo url!!!");
            }
        }
    },
    about : {
        type : String,
        default: "This is the default about of the user!!!",
    },
    skills: {
        type : [String],
    }
},{timestamps : true});




//creating jwt token
userSchema.methods.getJWT = async function(){
    const user = this;

    const Token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    return Token;
};

    
//decrypting the password
userSchema.methods.validatePassword = async function(password){
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password); //compare returns a boolean value

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;