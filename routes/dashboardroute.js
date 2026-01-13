const express=require('express')
const { getAdminDashboardStats } = require("../controller/admindashboardcontroller");

const router=express.Router()

router.get("/admin/dashboard", getAdminDashboardStats);
