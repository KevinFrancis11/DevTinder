const express = require('express');


const app = express();


app.use("/about",(req, res)=>{
    res.send("About us")
})

app.use("/",(req, res)=>{
    res.send("Hello from the server")
})


app.listen(3001, ()=>{
    console.log("server running succeessfully on port 3001.....");
})