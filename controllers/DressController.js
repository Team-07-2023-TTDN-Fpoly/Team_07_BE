const Dress = require("../models/DressSchema.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dq1ojjdde",
  api_key: "418354474777134",
  api_secret: "bZ1PT7qyKY13ner2rxWv2CS8rfw",
});

const DressController = {
  getDress: async (req, res) => {
    try {
      const dress = await Dress.findById(req.params.id)
        .populate({
          path: "dressTypeId",
          model: "DressType",
        })
        .lean();
      const responseData = {
        id: dress._id,
        dress_name: dress.dress_name,
        dress_price: dress.dress_price,
        size: dress.size,
        color: dress.color,
        dress_image: dress.dress_image,
        dress_description: dress.dress_description,
        dress_status: dress.dress_status,
        dressTypeId: {
          type_id: dress.dressTypeId._id,
          type_name: dress.dressTypeId.type_name,
        },
      };
      res.status(200).json({
        data: responseData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDresses: async (req, res) => {
    try {
      const dresses = await Dress.find()
        .populate({
          path: "dressTypeId",
          model: "DressType",
        })
        .lean();
      const list = dresses.map((dress) => {
        return {
          id: dress._id,
          dress_name: dress.dress_name,
          dress_price: dress.dress_price,
          size: dress.size,
          color: dress.color,
          dress_image: dress.dress_image,
          dress_description: dress.dress_description,
          dress_status: dress.dress_status,
          dressTypeId: {
            type_id: dress.dressTypeId._id,
            type_name: dress.dressTypeId.type_name,
          },
        };
      });
      res.status(200).json({ data: list });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  addDress: async (req, res) => {
    const {
      dress_name,
      dressTypeId,
      dress_price,
      size,
      color,
      dress_description,
    } = req.body;
    try {
      console.log(req.file);
      if (!dress_name) {
        throw new Error("Vui lòng nhập tên!");
      }
      if (!dress_price || (dress_price && isNaN(dress_price))) {
        throw new Error("Giá của áo cưới phải là số!");
      }
      if (!dressTypeId) {
        throw new Error("Vui lòng chọn loại áo cưới!");
      }
      const dressData = {
        dress_name: dress_name,
        dressTypeId: dressTypeId,
        dress_price: dress_price,
        size: size,
        color: color,
        dress_description: dress_description,
      };

      if (!req.file) {
        throw new Error("Vui lòng chọn ảnh");
      }
      dressData.dress_image = req.file.path;

      const newDress = new Dress(dressData);
      const savedDress = await newDress.save();
      res.status(201).json({ data: savedDress._id });
    } catch (error) {
      if (req.file && req.file.path) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(400).json({ message: error.message });
    }
  },

  updateDress: async (req, res) => {
    const updateData = req.body;

    try {
      const dress = await Dress.findById(req.params.id);
      if (!dress) {
        throw new Error("Áo cưới không tồn tại!");
      }
      if (updateData.dress_price && isNaN(updateData.dress_price)) {
        // Sửa đổi điều kiện này
        throw new Error("Giá cả phải là số!");
      }
      if (req.file) {
        updateData.dress_image = req.file.path;
      }

      await Dress.findByIdAndUpdate(req.params.id, updateData, { new: true });

      res.status(200).json({ message: "Cập nhật thành công!" });
    } catch (error) {
      if (req.file && req.file.path) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      res.status(400).json({ message: error.message });
    }
  },

  deleteDress: async (req, res) => {
    try {
      const dress = await Dress.findById(req.params.id);
      if (!dress) {
        return res.status(400).json({ message: "Áo cưới không tồn tại!" });
      }
      // Đối với việc xóa ảnh, bạn cần lấy public_id từ URL
      const parts = dress.dress_image.split("/");
      const fileName = parts.pop(); // Lấy phần cuối cùng của URL
      const publicId = fileName.split(".")[0]; // Loại bỏ phần mở rộng

      await cloudinary.uploader.destroy(publicId);

      await dress.remove();
      res.json({ message: "Dress removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = DressController;
