const validator = require('validator');

//signup validation
const validateSignUpData = (req) => {

    const allowedSignUpAllowed = ["firstName", "secondName", "emailId", "password", "age", "skills", "about", "gender", "photoURL"];

    const isSingnUpAllowed = Object.keys(req.body).every(fields => allowedSignUpAllowed.includes(fields));

    if(!isSingnUpAllowed){
        throw new Error("Invalid signup request!!!!");
    }

    const { firstName, secondName, emailId, password } = req.body;

    if(!firstName || !secondName){
        throw new Error("Please enter your name!!!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email address!!!!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!!!!");
    }

};


//login validation
const validateLoginData = (req)=>{

    const allowedLoginData = ["emailId", "password"];

    const isLoginAllowed = Object.keys(req.body).every(fields => allowedLoginData.includes(fields));

    if(!isLoginAllowed){
        throw new Error("Invalid login request!!!!");
    }

    const { emailId } = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email address!!!!");
    }
};



//edit validation
const validateEditProfileData = (req)=>{

    const allowedEditFields = [
        "firstName",
        "secondName",
        "photoURL",
        "age",
        "skills",
        "about",
        "gender",
    ]

    const isEditAllowed = Object.keys(req.body).every(fields => allowedEditFields.includes(fields));

    return isEditAllowed;

};


//password validation
const validateEditPasswordData = (req)=>{
    const allowedEditFields = ["password"];

    const pass = req.body.password;

    const isEditAllowed = Object.keys(req.body).every(fields=> allowedEditFields.includes(fields));

    if(!isEditAllowed){
        throw new Error("Invalid login request!!!!");
    }


    if(!validator.isStrongPassword(pass)){
        throw new Error("Please enter a strong password!!!!");
    }

}





module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData,
    validateEditPasswordData,
};