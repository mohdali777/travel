const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'public/uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("Only images are allowed (JPEG, PNG, GIF)"), false); 
  }
};

const upload = multer({
  storage,         
  fileFilter,      
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;