// multer-config.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình cloudinary với thông tin API của bạn
cloudinary.config({
  cloud_name: "dq1ojjdde",
  api_key: "418354474777134",
  api_secret: "bZ1PT7qyKY13ner2rxWv2CS8rfw",
});

// Cấu hình storage để sử dụng Cloudinary:
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dress_images", // Thư mục lưu trữ trên Cloudinary
    allowedFormats: ["jpeg", "png", "jpg"], // Định dạng file cho phép
    public_id: (req, file) => {
      return `${file.originalname}_${Date.now()}`;
    }, // Tùy chỉnh ID file nếu cần
    // Bạn có thể sử dụng các thông tin từ `req` hoặc `file` để tạo public_id
  },
});

// Tạo middleware `parser` sử dụng storage đã cấu hình
const parser = multer({ storage: storage });

module.exports = parser;
