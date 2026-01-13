const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder must exist
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // get file extension
    const uniquename = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniquename + ext);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
