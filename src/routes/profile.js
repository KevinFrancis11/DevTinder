const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateEditProfileData, validateEditPasswordData } = require('../utils/validate');

const router = express.Router();


//view profile
router.get('/profile/view', userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.status(200).send(user);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});



//edit profile
router.patch('/profile/edit', userAuth, async(req, res)=>{
    try{

        if(!validateEditProfileData(req)){
            throw new Error("Invalide edit request!!!!!");
        }

        // const user = req.user;

        // const { 
        //     firstName, 
        //     secondName, 
        //     age, 
        //     skills, 
        //     gender, 
        //     photoURL, 
        //     about } = req.body;

        // const filter = user._id;
        // const update = {
        //     $set: {
        //         firstName,
        //         secondName,
        //         age,
        //         skills,
        //         gender,
        //         photoURL,
        //         about
        //     }
        // };

        // const doc = await User.findOneAndUpdate(filter, update, {returnDocument: 'after'});

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

        await loggedInUser.save();


        res.status(200).json({message: "Profile updated", data: loggedInUser});
        

    }catch(err){
        res.status(401).send("ERROR: "+err.message);
    }
});


//edit password
router.patch('/profile/password', userAuth, (req, res)=>{
    try{

        validateEditPasswordData(req);
        
        const loggedInUser = req.user;        

        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

        loggedInUser.save();

        res.status(200).send("Password was updated Successfully!!!!");



    }catch(err){
        res.status(401).send("ERROR: "+err.message);
    }
})


module.exports = router;