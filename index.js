require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors({
  origin: [
    "https://device-manager-frontend.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

// 🔥 CREATE UPLOADS FOLDER IF NOT EXISTS (VERY IMPORTANT)
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Serve images
app.use('/uploads', express.static(uploadPath));

// DB
const connectToMongo = require("./db");
connectToMongo();

const portno = process.env.PORT || 5000;
app.listen(portno, () => {
  console.log("Server running on port " + portno);
});

app.get('/api', (req, res) => {
  res.send("Hello postman");
});

app.use('/api/device', require('./routes/deviceroute'));
app.use('/api/user', require('./routes/userroute'));
app.use('/api/admin', require('./routes/adminroute'));
app.use('/api/cart', require('./routes/cartroutes'));
app.use('/api/order', require("./routes/orderroutes"));
