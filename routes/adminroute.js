const express = require("express");
const router = express.Router();
const { AdminLogin,Register } = require("../controller/admincontroller");

router.post("/admininsert", Register);
router.post("/adminlogin", AdminLogin);

module.exports = router;
