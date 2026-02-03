const userschema=require('../Model/usermodel')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const SECRET_KEY='mernstack'

const Addregisteruser=async(req,res)=>{
    try {
        const {uname,uemail,upassword,uphone,uaddress}=req.body
         console.log("Received:", req.body);
        const hashpassword=await bcryptjs.hash(upassword,10)
        const usedata=new userschema({name:uname,email:uemail,password:hashpassword,phone:uphone,address:uaddress})
        await usedata.save()
        res.status(201).json({message:"user created",usedata})
        //console.log('user added')
        
    } catch (error) {
        res.status(500).json({message:"server error",error})
        console.log(error)
    }
}
// const Login=async(req,res)=>{
//     try {
//         const{email,password}=req.body;
//         const matcheduser=await userschema.findOne({
//         email:email,
    
//     })
//     if(!matcheduser)
//         res.json({success:false,message:"user not found"})

//     console.log(matcheduser);
//     const checkpass =await bcryptjs.compare(password,matcheduser.password);
//     if(!checkpass){
//         return res.json({success:false,message:'invalid credentials'});
//     }
//            if(!matcheduser){
//             res.json({success:false,message:"invalid user"})
//            }else{
//             const Token=await jwt.sign({id:matcheduser._id,name:matcheduser.name},SECRET_KEY)
//             console.log(Token)
//            res.json({success:true,message:"Login successfull",Token})
            
//         }
//     if(matcheduser.password !==password){
//         res.json({success:false,message:"password not match"})
//     }
//             res.json({success:true,message:"Login successfull",matcheduser})

        
//     } catch (error) {
//         console.log(error)
//                    res.json({success:false,message:"server error"})

//     }
// }
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const matcheduser = await userschema.findOne({ email });
    if (!matcheduser) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, matcheduser.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: matcheduser._id, name: matcheduser.name },
      SECRET_KEY
    );

    return res.json({
      success: true,
      message: "Login successful",
      Token: token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const Getuser=async(req,res)=>{
    try {
        const getusers=await userschema.find();
        console.log(getusers)
        res.status(200).json({message:'user successful',getusers})
    } catch (error) {
        res.status(500).json({message:'Server Error',error})
        console.log(error)
        
    }
    
}
const Deleteuser=async(req,res)=>{
    try{
        const {mid}= req.params;
    const deleteuser= await userschema.findByIdAndDelete(mid);
    res.status(200).json({message:'user deleted successfully',deleteuser})
    }
    catch(error){
    console.log(error)
    }
}

const Getprofile = async(req,res)=>{
    try {
        const iduser = req.userId.id;
        const user = await userschema.findById(iduser);
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        res.status(200).json({message:'user found',user})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error'})
    }
}


const Updateprofile = async(req,res)=>{
    try {
        const iduser = req.userId.id;
        const user = await userschema.findById(iduser);
        if(!user){
            return res.status(404).json({message:'user not found'});
        }

        const updateform = {
            name:req.body.uname,
            email:req.body.uemail,
            phone:req.body.uphone,
            address:req.body.uaddress
        }

        const updateprofile = await userschema.findByIdAndUpdate(iduser,updateform,{new:true});
        res.status(200).json({message:'profile updated',user:updateprofile})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'server error'})
    }
}

const GetuserById=async(req,res)=>{
try {
    const {uid} = req.params //get id from url
    const oneuser=await userschema.findById(uid);
    if(!oneuser){
        return res.status(404).json({message:"user not found"})
    }
    res.status(200).json({message:"user found",oneuser})

    console.log(oneuser)
} catch (error) {
    res.status(500).json({message:"server error",error})
    console.log(error)
}
}
     
module.exports={Addregisteruser,Login,Getuser,Deleteuser,Getprofile,Updateprofile,GetuserById}