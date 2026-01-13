
const Order = require("../Model/ordermodel");
const User = require("../Model/usermodel");
const Device = require("../Model/devicemodel");
const jwt=require('jsonwebtoken')
const SECRET_KEY='mernstack'

const createOrder = async (req, res) => {
  try {
    const userId = req.userId.id;
    const { customer, items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const formattedItems = items.map(item => ({
      deviceId: item.productId?._id || item.productId,
      quantity: item.quantity,
      shippingStatus: "Pending",
    }));

    const order = new Order({
      userId,
      customer,
      items: formattedItems,
      total,
    });

    await order.save();

    const savedOrder = await Order.findById(order._id)
      .populate("items.deviceId");

    res.status(201).json({ order: savedOrder });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Order failed" });
  }
};


const getOrdersByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const orders = await Order.find({
      "items.deviceId": deviceId
    }).populate("items.deviceId");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.shippingStatus": status } },
      { new: true }
    );

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getDeviceOrderStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const orders = await Order.find({
      "items.deviceId": deviceId
    });

    // 🔹 If no orders
    if (orders.length === 0) {
      return res.json({ status: "Pending" });
    }

    // 🔹 Collect all item statuses for this device
    let allDelivered = true;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.deviceId.toString() === deviceId) {
          if (item.shippingStatus !== "Delivered") {
            allDelivered = false;
          }
        }
      });
    });

    if (allDelivered) {
      return res.json({ status: "Delivered" });
    }

    return res.json({ status: "Shipping" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, deviceId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.find(
      i => i.deviceId.toString() === deviceId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🚫 block cancel if shipped/delivered
    if (item.shippingStatus !== "Pending") {
      return res.status(400).json({
        message: "Cannot cancel after shipping started"
      });
    }

    // remove item
    order.items = order.items.filter(
      i => i.deviceId.toString() !== deviceId
    );

    await order.save();

    res.json({ message: "Item cancelled", order });

  } catch (error) {
    res.status(500).json({ message: "Cancel failed", error });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (!req.userId || !req.userId.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.userId.id;

    const orders = await Order.find({ userId })
      .populate("items.deviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("MyOrders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    // 1️⃣ Ensure user is authenticated
    if (!req.userId || !req.userId.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.userId.id;
    const { orderId } = req.params;

    // 2️⃣ Find order that belongs to THIS user only
    const order = await Order.findOne({
      _id: orderId,
      userId
    }).populate("items.deviceId");

    // 3️⃣ If order not found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 4️⃣ Send order
    res.status(200).json({ order });

  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateDeliveryStatusByAdmin = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { shippingStatus } = req.body;

    if (!shippingStatus) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["Pending", "Shipping", "Delivered"];
    if (!validStatuses.includes(shippingStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.shippingStatus": shippingStatus } },
      { new: true }
    ).populate("items.deviceId");

    if (!order) {
      return res.status(404).json({ message: "Order or Item not found" });
    }

    res.status(200).json({
      message: "Delivery status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update Delivery Status Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.deviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Admin Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDevices = await Device.countDocuments();
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

module.exports = { getAdminDashboardStats }; // ✅ FIX


module.exports = { getOrdersByDevice, updateItemStatus,getDeviceOrderStatus, createOrder, cancelOrderItem, getMyOrders, getOrderById, 
  updateDeliveryStatusByAdmin, getAllOrdersForAdmin, getAdminDashboardStats 
 };
