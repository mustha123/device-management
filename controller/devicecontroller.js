const deviceschema=require('../Model/devicemodel')
const jwt=require('jsonwebtoken')
const SECRET_KEY='mernstack'


const Addproduct=async(req,res)=>{
  try {
     const UserImage = req.file ? req.file.filename: null;
    const{dname,dtype,dbrand,ddate,dprice}=req.body;
    
    const devicedata=new deviceschema(
      {device_name:dname,
        device_type:dtype,
        device_brand:dbrand,
        device_image:UserImage,
        device_date:ddate,
        device_price:dprice
      }
    )
    await devicedata.save()
    res.status(201).json({message:'device created',devicedata})
    console.log('device added ')
  } catch (error) {
    console.log(error)
  }
}
const Getproduct=async(req,res)=>{
   try {
     const getproducts=await deviceschema.find() //.populate("categoryId","catogary_name  ");}


    console.log(getproducts)
    res.status(200).json({message:'product successful',getproducts})
   } catch (error) {
    console.log(error)
    res.status(500).json({message:"server error",error})    
   }
}
const Deletedevice=async(req,res)=>{
   try {
     const {pid}=req.params;
    const dprod=await deviceschema.findByIdAndDelete(pid);


    
    res.status(200).json({message:"Item deleted successfully",dprod})


    
   } catch (error) {
    console.log(error)
   }
}

const Updatedevice = async (req, res) => {
  try {
    const { pid } = req.params;

   const updateData = { ...req.body };
     if (req.file) {
      updateData.device_image = req.file.filename; 
    }

    const updatedevice = await deviceschema.findByIdAndUpdate(pid, updateData, { new: true });

    if (!updatedevice) {
      return res.status(404).json({ message: "Item not Found" });
    }

    return res.status(200).json({ message: 'Product updated successfully', updatedevice });
    
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const GetdeviceById=async(req,res)=>{
  try{
  const {pid}=req.params
  const oneproduct= await deviceschema.findById(pid)
  if(!oneproduct){
    return(res.status(404).json({message:'Item not found'}))
  }
    console.log(oneproduct)
  res.status(200).json({message:'Item Found',oneproduct})
}
catch(error){
  res.status(500).json({message:'Server error',error})
}


}
module.exports = {Addproduct,Getproduct,Deletedevice,Updatedevice,GetdeviceById};