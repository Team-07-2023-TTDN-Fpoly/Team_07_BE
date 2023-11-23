const WorkShift = require("../models/WorkShiftSchema");
const validator = require("validator"); // dùng để kiểm tra dữ liệu

class WorkShiftController {
  static async createWorkShift(req, res) {
    const { name, timeStart, timeEnd, shift_description } = req.body;
    console.log(req.body);
    try {
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
    const { ...data } = req.body;
    try {
      const workShift = await WorkShift.findByIdAndUpdate(
        id,
        {
          ...data,
        },
        { new: true }
      );
      if (!workShift) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json({ data: workShift._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllWorkShift(req, res) {
    try {
      const workShifts = await WorkShift.find();
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
}
module.exports = WorkShiftController;
