const Admin = require("../Model/adminmodel");
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const SECRET_KEY = "mernstack"

const Register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log("Received:", req.body);

        // Check if user already exists
const existingUser = await Admin.findOne({ email });
console.log("Existing user check:", existingUser); // <--- Add this

if (existingUser) {
    return res.status(400).json({
        message: "Email already registered, please login"
    });
}

        const hashpassword = await bcryptjs.hash(password, 10);
        const usedata = new Admin({
            email: email,
            password: hashpassword,
            role: role
        });

        await usedata.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: usedata
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};


const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const matcheduser = await Admin.findOne({ email });

    if (!matcheduser) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcryptjs.compare(password, matcheduser.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    //  Generate JWT using password + secret key
    const token = jwt.sign(
      { 
        id: matcheduser._id,
        role: matcheduser.role,
        email: matcheduser.email
      },
      SECRET_KEY + password
    );

    return res.json({
      success: true,
      message: "Login Successful",
      adminToken:token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = { AdminLogin,Register };
