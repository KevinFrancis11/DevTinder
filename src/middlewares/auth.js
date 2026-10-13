const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth =  async(req, res, next)=>{
try{
    //read the token from the req dot cookies
    const { Token } = req.cookies;
 
    
    if(!Token){
        return res.status(401).json({
            message: "Please login to continue yay!!!!!",
        });
    }

    //validate the token
    const decodedToken = await jwt.verify(Token, "DEV@Tinder$967");
    const {_id} = decodedToken;

    //find the user
    const user = await User.findById(_id);
    if(!user){
        throw new Error("Please login to continue!!!!");
    }

    req.user = user;
    next();

}catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
};

module.exports = {
    userAuth,
};