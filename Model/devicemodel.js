const mongoose=require('mongoose');
const deviceschema= new mongoose.Schema({
    device_name:{type:String,require:true},
    device_type:{type:String,require:true},
    device_brand:{type:String,require:true},
    device_image:{type:String,require:false},
    device_date:{type:Date,default:Date.now},
    device_price:{type:Number,require:true},
})
module.exports=mongoose.model('device',deviceschema)