const mongoose = require("mongoose")
require('dotenv').config();
//const mongoURL=
"mongodb://localhost:27017/devicemanager"
const mongoURL = process.env.MONGO_URI;
// 127.0.0.1 port number

const connectToMongo = async()=>{
    try{
        await mongoose.connect(mongoURL);
        console.log("connect to mongo successfull")
    }
    catch(error){
        console.log("error in connecting to mongo", error);
    }
}  
module.exports=connectToMongo;