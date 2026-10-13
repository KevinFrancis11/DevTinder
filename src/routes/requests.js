const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');


const router = express.Router();

router.post('/request/send/:status/:toUserId', userAuth, async(req, res)=>{
  try{

    
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;


    //check if the fromUserId is sending connectionRequest to fromUserId itself
    // it is done in the connectionRequest.js using the pre save method.


    //check if toUserId exist in the DB
    const toUser = await User.findById(toUserId);

    if(!toUser){
      return res.status(404).json({
        message: "User not found!!!"
      });
    }


    //check if the allowed status types are sending by user
    const allowedStatusType = ["interested", "ignored"];

    if(!allowedStatusType.includes(status)){
        return res.status(401).json({
            message: "Invalid status type!!!",
        });
    }



    //check if there is an existing connectionRequest(check if both A->B and B->A connectionRequest exits)
    const existingConnectionRequest = await ConnectionRequest.findOne(
      {
        $or: [
          {fromUserId, toUserId},
          {fromUserId: toUserId, toUserId: fromUserId},
        ]
      }
    )

    if(existingConnectionRequest){
      return res.status(401).json({
        message: "Connection request already exists!!!!!"
      });
    }




    //sending the connection request
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });

    //saving the connectionRequest in the DB
    const data = await connectionRequest.save();

    if(status == "ignored"){

    }

    res.status(200).json({
        message: `${req.user.firstName} is ${status==='interested'?'interested':'not interested'} in ${toUser.firstName}`,
        data
        //req.user.firstName+" is "+status+ " in "+ toUser.firstName,
    });

  }catch(err){

    res.status(401).send("ERROR: "+err.message);

  }
});



router.post('/request/review/:status/:requestId', userAuth, async(req, res)=>{
  try{

    const loggedInUser = req.user;
    const { status, requestId } = req.params;


    //validate the status
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(404).json({
        message: "Status not allowed!!!"
      });
    }


    //check if the request exist in DB
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if(!connectionRequest){
      res.status(404).json({
        message: "Connection Request not found!!!!"
      });
    }
    

    //if got the connectioRequest then change the status in the connectionRequest and save in DB
    connectionRequest.status = status;

    const data = await connectionRequest.save();


    res.status(200).json({
      message: "Connection "+status,
      data
    });

    


  }catch(err){
    res.status(404).send("ERROR: "+err.message);
  } 
})

module.exports = router;