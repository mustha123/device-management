const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  customer: {
    fullName: String,
    mobile: String,
    address: String,
  },

  items: [
    {
      deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "device",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      shippingStatus: {
        type: String,
        enum: ["Pending", "Delivered"],
        default: "Pending",
      },
    },
  ],

  total: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema);
