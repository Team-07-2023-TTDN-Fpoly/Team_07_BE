const DressType = require("../models/DressTypeSchema");

class DressTypeController {
  static async createDressType(req, res) {
    const { type_name } = req.body;
    try {
      if (!type_name) {
        return res.status(400).json({ message: "Vui lòng điền tên loại áo" });
      }
      const dressType = await DressType({
        type_name: type_name,
      }).save();
      console.log(dressType);
      res.status(201).json({ data: dressType._id });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateDressType(req, res) {
    const { id } = req.params;
    const { type_name } = req.body;
    try {
      const dressType = await DressType.findByIdAndUpdate(
        id,
        {
          type_name: type_name,
        },
        { new: true }
      );
      if (!dressType) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json({ message: "Cập nhật thành công!" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllDressType(req, res) {
    try {
      const dressTypes = await DressType.find();
      const list = dressTypes.map((dressType) => {
        return {
          type_id: dressType.id,
          type_name: dressType.type_name,
        };
      });
      res.status(200).json({ data: list });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async getDressType(req, res) {
    try {
      const dressType = await DressType.find();
      if (!dressType) {
        return res.status(400).json({ message: "Không tìm thấy loại áo" });
      }

      res.status(200).json({
        data: {
          type_id: dressType.id,
          type_name: dressType.type_name,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
module.exports = DressTypeController;
