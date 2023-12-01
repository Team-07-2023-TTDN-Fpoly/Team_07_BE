const WorkShift = require("../models/WorkShiftSchema");
const validator = require("validator"); // dùng để kiểm tra dữ liệu

class WorkShiftController {
  static async createWorkShift(req, res) {
    const { name, timeStart, timeEnd, shift_description } = req.body;
    try {
      if (!name) {
        res.status(400).json({ message: "Vui lòng nhập tên ca làm!" });
      }
      const workShift = await WorkShift({
        name,
        timeStart,
        timeEnd,
        shift_description,
      }).save();
      console.log(workShift);
      res.status(201).json({ data: workShift._id });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateWorkShift(req, res) {
    const { id } = req.params;
    const { name, timeStart, timeEnd, shift_description } = req.body;
    try {
      const workShift = await WorkShift.findByIdAndUpdate(
        id,
        {
          name: name,
          timeStart: timeStart,
          timeEnd: timeEnd,
          shift_description: shift_description,
        },
        { new: true }
      );
      if (!workShift) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllWorkShift(req, res) {
    const { search } = req.query;
    try {
      let query = { hidden: false };
      //Tìm kiếm theo tên
      if (search) {
        query.name = { $regex: search, $options: "i" }; // 'i' không phân biệt hoa thường
      }
      //
      const workShifts = await WorkShift.find(query);
      const list = workShifts.map((workShift) => {
        return {
          shift_id: workShift.id,
          name: workShift.name,
          timeStart: workShift.timeStart,
          timeEnd: workShift.timeEnd,
          shift_description: workShift.shift_description,
        };
      });
      res.status(200).json({ data: list });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getWorkShift(req, res) {
    try {
      const workShift = await WorkShift.findByIdId(req.params.id);
      if (!workShift) {
        return res.status(400).json({ message: "Không tìm thấy ca làm" });
      }
      res.status(200).json({
        data: {
          shift_id: workShift.id,
          name: workShift.name,
          timeStart: workShift.timeStart,
          timeEnd: workShift.timeEnd,
          shift_description: workShift.shift_description,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async deleteWorkShift(req, res) {
    try {
      const workShift = await WorkShift.findByIdAndUpdate(req.params.id, {
        hidden: true,
      },{new :true});
      if (!workShift) {
        return res.status(400).json({ message: "Ca làm không tồn tại!" });
      }
      res.status(200).json({ message: "Ca làm đã được xóa" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = WorkShiftController;
