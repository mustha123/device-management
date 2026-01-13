const mongoose = require("mongoose");

const admnschema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    // unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin"
  },
  phone: {
    type: String
  },
  address: {
    type: String
  }
});

module.exports = mongoose.model("Admin", admnschema);
