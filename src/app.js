const express = require('express');
const {connectDB} = require("./config/database.js");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestsRouter = require('./routes/requests.js');
const userRouter = require('./routes/user.js');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestsRouter);
app.use('/', userRouter);




//database connection and port connection
connectDB().then(()=>{
    console.log("Database Connected Successfully");

    app.listen(7777, ()=>{
    console.log("server running succeessfully on port 7777.....");
})
}).catch(err=>{
    console.log("Database cannot be connected!!!");   
})