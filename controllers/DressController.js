const Dress = require("../models/DressSchema.js");
const cloudinary = require("cloudinary").v2;
const { formatDressData } = require("../utils/FormatDressData.js");
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
      if (!dress || dress.hidden) {
        return res.status(400).json({ message: "Không tìm thấy áo cưới!" });
      }
      const responseData = formatDressData(dress);
      res.status(200).json({
        data: responseData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDresses: async (req, res) => {
    const { search } = req.query;
    try {
      let query = { hidden: false };
      //Tìm kiếm theo tên
      if (search) {
        query.dress_name = { $regex: search, $options: "i" }; // 'i' không phân biệt hoa thường
      }
      //
      const dresses = await Dress.find(query)
        .populate({
          path: "dressTypeId",
          model: "DressType",
        })
        .lean();
      const list = dresses.map((dress) => {
        return formatDressData(dress);
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
      dress_status,
    } = req.body;
    try {
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
        dress_price: Number(dress_price),
        size: size,
        color: color,
        dress_description: dress_description,
        dress_status: dress_status || "Sẵn sàng",
      };
      if (!req.file) {
        throw new Error("Vui lòng chọn ảnh");
      }
      dressData.dress_image = req.file.path;

      const newDress = new Dress(dressData);
      const savedDress = await newDress.save();
      res.status(201).json({ data: savedDress._id });
    } catch (error) {
      console.log("error add",error.message);
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
      const dress = await Dress.findByIdAndUpdate(
        req.params.id,
        { hidden: true },
        { new: true }
      );
      if (!dress) {
        return res.status(400).json({ message: "Áo cưới không tồn tại!" });
      }

      res.status(200).json({ message: "Áo cưới đã được xóa" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = DressController;
