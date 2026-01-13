const express=require('express')
const {Addproduct, Getproduct, Deletedevice,Updatedevice,GetdeviceById}=require('../controller/devicecontroller');
const Upload =require('../Middleware/uploads')
const router=express.Router()


router.post('/Adddevice',Upload.single('dimage'),Addproduct)
router.get('/getdevice',Getproduct)
router.delete('/deleteitem/:pid',Deletedevice)
router.put('/updateitem/:pid',Upload.single('dimage'),Updatedevice)
router.get('/getdevicebyid/:pid',GetdeviceById)


module.exports=router   