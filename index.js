const express = require('express');
//2
const app=express();
//cross origin resource sharing
const cors=require('cors')
 app.use(cors())
 app.use(express.json())
//3
const connectToMongo = require("./db")
connectToMongo();
//4
const portno=5000;
app.listen(portno,()=>{
    console.log("server is running on portnumber"  + portno)

});
app.get('/api',(req,res)=>{
    res.send("Hello postman")
})

app.use('/api/device',require('./routes/deviceroute'))
app.use('/api/user',require('./routes/userroute'))

app.use('/uploads', express.static('uploads'));
app.use('/api/admin', require('./routes/adminroute'))

const cartroute = require('./routes/cartroutes');
app.use('/api/cart', cartroute);

const orderroutes = require("./routes/orderroutes");

app.use("/api/order", orderroutes);


// const orderRoutes = require("./routes/orderroutes");

// app.use("/api/order", orderRoutes);


