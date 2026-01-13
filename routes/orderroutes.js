const express = require("express");
const authuser = require("../Middleware/authuser");
const {
  updateItemStatus,getOrdersByDevice,getDeviceOrderStatus, createOrder, 
  cancelOrderItem, getMyOrders, getOrderById, updateDeliveryStatusByAdmin,
getAllOrdersForAdmin, getAdminDashboardStats } = require("../controller/ordercontroller");


const router = express.Router();

// update shipping status of single device in order
router.put(
  "/update-item-status/:orderId/:itemId",
  updateItemStatus
);

// get all orders for a specific device
router.get(
  "/getorderdevicebyid/:deviceId",
  getOrdersByDevice
);
router.get(
  "/device-status/:deviceId",
  getDeviceOrderStatus
);

router.post("/create",authuser, createOrder);

router.put("/cancel-item/:orderId/:deviceId",authuser, cancelOrderItem);


router.get("/myorders",authuser, getMyOrders);
router.get("/orderdetails/:orderId", authuser, getOrderById);

router.put(
  "/admin/update-delivery-status/:orderId/:itemId",
  updateDeliveryStatusByAdmin
);

router.get(
  "/admin-orders",
  getAllOrdersForAdmin
);

router.get("/admin/dashboard", getAdminDashboardStats);


module.exports = router;
