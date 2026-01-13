
const express=require('express')
const { Addregisteruser, Getuser, Deleteuser,Getprofile, Updateprofile,GetuserById } = require('../controller/usercontroller')
const {  Login } = require('../controller/usercontroller')
const authuser = require('../Middleware/authuser')

const router=express.Router()

router.post('/addregisteruser',Addregisteruser)
router.post('/login',Login)
router.get('/getuser',Getuser)
router.delete('/deleteuser/:mid',Deleteuser)
router.get('/Getprofile',authuser,Getprofile)
router.put('/Updateprofile',authuser, Updateprofile)
router.get('/getuserbyid/:uid',GetuserById )

module.exports=router