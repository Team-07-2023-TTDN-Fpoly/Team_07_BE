const DetailStatistics = require("../models/DetailStatisticsSchema.js");
const mongoose = require("mongoose");
const validator = require("validator");
const { formatStatisticData } = require("../utils/FormatStatisticData.js");

const DetailStatisticsController = {
  //Thêm mới khoản chi
  CreateDetail: async (req, res) => {
    try {
      const { dt_date, dt_name, dt_money, dt_text } = req.body;

      //validate tên khoản chi
      if (!dt_name || dt_name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Tên khoản chi không được để trống." });
      }
      //validate số tiền
      if (!dt_money) {
        return res.status(400).json({ message: "Không được để trống dữ liệu" });
      }
      //validate tháng chi
      if (!dt_date) {
        return res.status(400).json({message: "Vui lòng chọn tháng chi"});
      }
      //thêm mới khoản chi
      const detail = new DetailStatistics({
        dt_date,
        dt_name,
        dt_money,
        dt_text,
      });
      await detail.save();
      console.log(detail)
      res.status(201).json({ data: detail._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //update khoản chi
  UpdateDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const { dt_name, dt_money, dt_text } = req.body;
      //validate tên khoản chi
      if (!dt_name || dt_name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Tên khoản chi không được để trống." });
      }
      //validate số tiền
      if (!employeeData.dt_money || !validator.isLength(dt_money)) {
        return res.status(400).json({ message: "Không được để trống dữ liệu" });
      }
      //validate mô tả
      if (!dt_text || dt_text.trim() === "") {
        return res.status(400);
      }

      const details = await DetailStatistics.findByIdAndUpdate(
        id,
        {
          dt_name,
          dt_money,
          dt_text,
        },
        { new: true }
      );

      if (!details) {
        return res.status(404).json({ message: "Khoản chi không tồn tại" });
      }

      res.status(200).json({ message: "Cập nhật thông tin thành công" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy danh sách tất cả chi
  getAllDetail: async (req, res) => {
    try {
      // Lấy tất cả bản ghi
      const detailList = await DetailStatistics.find().lean();
      // Tính tổng dt_money theo dt_date
      const totalByDate = {};
      const detailsByDate = {};
      for (let i = 0; i < detailList.length; i++) {
        const currentDate = detailList[i].dt_date.toISOString().split("T")[0];
        if (!totalByDate[currentDate]) {
          totalByDate[currentDate] = 0;
          detailsByDate[currentDate] = [];
        }
        totalByDate[currentDate] += Number(detailList[i].dt_money);
        detailsByDate[currentDate] = [
          ...detailsByDate[currentDate],
          formatStatisticData(detailList[i]),
        ];
      }
      // In ra tổng dt_money theo dt_date
      // Chuyển đối tượng thành mảng kết quả
      const resultArray = Object.entries(totalByDate).map(([date, total]) => ({
        dt_date: new Date(date),
        total_amount: total,
        list_amount: detailsByDate[date],
      }));

        console.log(resultArray)
      res.status(200).json({ data: resultArray });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
module.exports = DetailStatisticsController;
