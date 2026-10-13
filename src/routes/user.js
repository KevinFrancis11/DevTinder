const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = ["firstName", "secondName", "photoURL", "age", "skills", "about", "gender"]

//Get all the pending connection request for the logged in user
userRouter.get('/user/requests/recieved', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

    

        if(connectionRequests.length==0){
            return res.status(200).json({
                message: "No pending requests",
            });
        }

        res.status(200).json({
            message: "Connection requests found",
            connectionRequests
        })

    }catch(err){
        res.status(404).send("ERROR: "+err.message);
    }
});


//get all the connection of a user
userRouter.get('/user/connection', userAuth, async(req, res)=>{
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id},
            ],
            status: "accepted",
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        // console.log(connectionRequests);

        if(connectionRequests.length==0){
            return res.status(200).json({
                message: "You dont have any connections!!!!"
            });
        }

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }

            return row.fromUserId;
            
            });

        res.status(200).json({
            message: "Your connections",
            data

        })


    }catch(err){
        res.status(400).json({
            message: err.message
        });
    }
})


//feed api
userRouter.get('/user/feed', userAuth, async(req, res)=>{
    try{    

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50? 50 : limit;
        const skip = (page-1)*limit;

        //find all the connection of the user(send and recieved)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},   
                {fromUserId: loggedInUser._id}
            ],
        }).select("fromUserId toUserId");


        // console.log(connectionRequests)

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // console.log(hideUsersFromFeed);

        const users = await User.find({
           $and: [
                 {_id: {$nin: Array.from(hideUsersFromFeed)}, },
                 {_id: {$ne: loggedInUser._id} },  
            ],              
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);


        res.send(users);


    }catch(err){
        res.status(404).json({
            message: err.message
        });
    }
});

module.exports = userRouter;