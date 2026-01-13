// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   customer: {
//     fullName: String,
//     mobile: String,
//     address: String,
//   },

//   items: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "device",
//       },
//       quantity: Number,
//     },
//   ],

//   total: Number,

//   status: {
//     type: String,
//     default: "Confirmed", // other values: Cancelled
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Order", orderSchema);
