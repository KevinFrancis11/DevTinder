const mongoose = require('mongoose');


const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://kevinfrancis967_db_user:FxDUpS6I3fkcD02i@cluster0.0wgcgr0.mongodb.net/devTinder"
    )
};

module.exports = {
    connectDB,
};


