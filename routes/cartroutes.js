const express = require("express");
const { addToCart, getCart, updateCart, deleteFromCart } = require("../controller/cartcontroller");
const authuser = require("../Middleware/authuser");

const router = express.Router();

router.post("/add", authuser, addToCart);
router.get("/get", authuser, getCart);
router.put("/update", authuser, updateCart);
router.delete("/delete/:productId", authuser, deleteFromCart);

module.exports = router;
