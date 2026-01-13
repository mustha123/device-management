const mongoose = require("mongoose")
const userschema=new mongoose.Schema({
    name:{
        type:String,required:true
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    address:{
        type:String    
},
date:{
    type:Date,
    default:Date.now
}

})


module.exports=mongoose.model("user",userschema)

