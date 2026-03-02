/* eslint-env node */

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "books",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }),
});

const upload = multer({ storage });

module.exports = upload;