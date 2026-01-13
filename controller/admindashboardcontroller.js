const userschema=require('../Model/usermodel')
const Order = require("../Model/ordermodel");
const deviceschema=require('../Model/devicemodel');
const express=require('express')

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await userschema.countDocuments();
    const totalDevices = await deviceschema.countDocuments();

    const orders = await Order.find();

    let totalRevenue = 0;
    let pending = 0, shipping = 0, delivered = 0;

    orders.forEach(order => {
      totalRevenue += order.total;

      order.items.forEach(item => {
        if (item.shippingStatus === "Pending") pending++;
        else if (item.shippingStatus === "Shipping") shipping++;
        else if (item.shippingStatus === "Delivered") delivered++;
      });
    });

    res.status(200).json({
      totalUsers,
      totalDevices,
      totalOrders: orders.length,
      totalRevenue,
      deliveryStats: { pending, shipping, delivered }
    });

  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

module.exports = { getAdminDashboardStats };
