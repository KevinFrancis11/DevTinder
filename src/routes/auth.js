const express = require('express');
const { validateSignUpData, validateLoginData } = require('../utils/validate.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');


const router = express.Router();


// signup
router.post("/signup", async(req, res)=>{
    try{
        //validation of the data
        validateSignUpData(req);
        const { firstName, secondName, emailId, password } = req.body;


        //encrypion of the password
        const passwordHash = await bcrypt.hash(password, 10);
        

        //creating an instance of the user model
        const user = new User({
            firstName,
            secondName,
            emailId,
            password: passwordHash,
        });
        const savedUser =  await user.save();

        //create token
        const token = await savedUser.getJWT();

        //add the token to cookie and send the res back to user
        res.cookie("Token", token);

        res.status(200).json({
            message: "Logged in successfully!!",
            data: savedUser,
        });
    }catch(err){
        res.status(500).send("ERROR: "+ err.message);
    }
   
});



//login
router.post("/login", async(req, res)=>{
    try{
        const{ emailId, password } = req.body;

        //validate emailId 
        validateLoginData(req);

        //check if emilId present in DB
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credential!!!!");
        }

        //check if password is valid
        const isPasswordValid = await user.validatePassword(password); //checking from the model/user.js
        if(isPasswordValid){
            
            //create a JWT token 
            const token = await user.getJWT();//checking from the model/user.js
            
            //add the token to cookie and send the response back to the user
            res.cookie("Token", token);

            res.status(200).json({
                message: "Login Successfull",
                user,
            })
        }else{
            // throw new Error("Invalid hi Credential!!!!");
            return res.status(403).json({
                message: "Invlid Credentials!!!",
            })
        }

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});




//logout
router.post("/logout", async(req, res)=>{

    // res.cookie("Token", '', {
    //     expires : new Date(Date.now())
    // });   
    
    res.clearCookie("Token");

    res.send("Logged out!!!!!");

});


module.exports = router;
