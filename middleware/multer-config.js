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

// Định dạng lại tên file được đẩy qua từ server
const customFileName = (req, file, cb) => {
  console.log(req);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = file.originalname.split(".")[0];
  cb(null, fileName + "-" + uniqueSuffix);
};

// Cấu hình storage để sử dụng Cloudinary:
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dress_images", // Thư mục lưu trữ trên Cloudinary
    allowedFormats: ["jpeg", "png", "jpg"], // Định dạng file cho phép
    transformation: [{ customFileName: customFileName }],
  },
});

// Tạo middleware `parser` sử dụng storage đã cấu hình
const parser = multer({ storage: storage });

// Middleware để xử lý tải tệp ảnh và trả về thông tin tệp ảnh dưới dạng JSON
const handleImageUpload = (req, res, next) => {
  parser.single("dress_image")(req, res, (err) => {
    console.log(req)
    if (err) {
      console.log("Lỗi ảnh ",err)
      // Xử lý lỗi Multer
      res.status(400).json({ message: "Lỗi khi tải lên tệp ảnh." });
    } else {
      // Trả về thông tin tệp ảnh dưới dạng JSON
      res.status(200).json({ imageUrl: req.file.path });
    }
  });
};
module.exports = { parser, handleImageUpload };
