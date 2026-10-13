const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUES} is incorrect status type`,
            },
        },
    },
    {timestamps: true},
);

//compund index for fast querying
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});



//check if the fromUserId is sending connectionRequest to fromUserId itself  
connectionRequestSchema.pre("save", function(){
    const connectionRequst = this;

    if(connectionRequst.fromUserId.equals(connectionRequst.toUserId)){
        throw new Error("Cannot send connection request to yourself!!");
    }

    
});


const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;