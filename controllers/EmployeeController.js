const Employee = require("../models/EmployeeSchema.js");
const Authentication = require("../models/AuthenticationSchema.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator"); // dùng để kiểm tra dữ liệu
const { formatEmployeeData } = require("../utils/FormatEmployeeData.js");
class EmployeeController {
  // Thêm nhân viên mới
  static async createEmployeeAndUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { email, password, ...employeeData } = req.body;
    try {
      // Kiểm tra email tồn tại trong Authentication

      // Validate tên nhân viên
      if (!employeeData.emp_name || validator.isEmpty(employeeData.emp_name)) {
        return res
          .status(400)
          .json({ message: "Tên nhân viên không được để trống." });
      }

      // Validate số điện thoại
      if (
        !employeeData.emp_phone ||
        !validator.isLength(employeeData.emp_phone, { min: 10, max: 10 })
      ) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }
      // Validate email
      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }

      // Validate password (ví dụ: độ dài tối thiểu là 6)
      if (!password || !validator.isLength(password, { min: 6 })) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
      }
      //validaotr lương
      if (!employeeData.basic_salary || isNaN(employeeData.basic_salary)) {
        return res.status(400).json({ message: "Vui lòng nhập lương." });
      }

      const existingUser = await Authentication.findOne({
        email: email,
      }).session(session);
      if (existingUser) {
        throw new Error("Email đã tồn tại");
      }

      // Tạo Employee mới
      const employee = await new Employee(employeeData).save({ session });
      // Tạo hash_password và salt
      const salt = bcrypt.genSaltSync(16);
      const hash_password = bcrypt.hashSync(password, salt);

      // Tạo Authentication mới
      await new Authentication({
        email,
        hash_password,
        emp_id: employee._id, // Tham chiếu ID của Employee mới tạo
        is_disable: false,
      }).save({ session });

      await session.commitTransaction();
      res.status(201).json({ data: employee._id });
    } catch (error) {
      // Nếu có lỗi, hủy bỏ transaction
      await session.abortTransaction();
      res.status(400).json({ message: error.message });
    } finally {
      session.endSession();
    }
  }

  // Cập nhật thông tin nhân viên
  static async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { ...employeeData } = req.body;
      // Validate tên nhân viên
      if (!employeeData.emp_name || validator.isEmpty(employeeData.emp_name)) {
        return res
          .status(400)
          .json({ message: "Tên nhân viên không được để trống." });
      }

      // Validate số điện thoại
      if (
        !employeeData.emp_phone ||
        !validator.isLength(employeeData.emp_phone, { min: 10, max: 10 })
      ) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }
      //validaotr lương
      if (!employeeData.basic_salary || isNaN(employeeData.basic_salary)) {
        return res.status(400).json({ message: "Vui lòng nhập lương." });
      }
      const employee = await Employee.findByIdAndUpdate(id, employeeData, {
        new: true,
      });
      if (!employee) {
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }
      res.status(200).json({ data: "Thay đổi thông tin thành công!" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  // Lấy thông tin một nhân viên theo ID
  static async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const auth = await Authentication.findOne({ emp_id: id }).populate({
        path: "emp_id",
        select:
          "emp_name emp_phone emp_address emp_birthday role workShiftId join_date basic_salary", // chỉ định các trường bạn muốn lấy từ Employee
        populate: {
          path: "workShiftId",
          model: "WorkShift",
        },
      });
      if (!auth) {
        return res
          .status(404)
          .json({ message: "Thông tin xác thực không tồn tại" });
      }
      // auth.emp_id sẽ chứa thông tin đầy đủ của nhân viên
      const employeeData = formatEmployeeData(auth);
      res.status(200).json({ data: employeeData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Lấy danh sách tất cả nhân viên
  static async getAllEmployees(req, res) {
    const { search } = req.query;
    try {
      let filter = {};
      let employeeIds = [];
      if (search) {
        const employees = await Employee.find({
          emp_name: { $regex: search, $options: "i" },
        }).select("_id");
        //danh sách id employee
        for (let i = 0; i < employees.length; i++) {
          employeeIds.push(employees[i]._id);
        }
      }
      if (employeeIds.length > 0) {
        filter["emp_id"] = { $in: employeeIds };
      }
      // Lấy tất cả bản ghi từ Authentication và populate thông tin Employee
      const authList = await Authentication.find(filter).sort({ createdAt: -1 }).populate({
        path: "emp_id",
        model: "Employee",
        populate: {
          path: "workShiftId",
          model: "WorkShift",
        },
      });
      // Xây dựng danh sách thông tin nhân viên với thông tin xác thực
      const employeeList = authList.map((auth) => {
        return formatEmployeeData(auth);
      });
      res.status(200).json({ data: employeeList });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  //Xóa nhân viên
  // Lấy thông tin một nhân viên theo ID
  static async deleteEmployee(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;

      // Xóa thông tin xác thực liên quan
      const authDeletionResult = await Authentication.findOneAndDelete({
        emp_id: id,
      }).session(session);
      if (!authDeletionResult) {
        throw new Error("Không tìm thấy thông tin xác thực để xóa.");
      }

      // Xóa nhân viên
      const employeeDeletionResult = await Employee.findByIdAndDelete(
        id
      ).session(session);
      if (!employeeDeletionResult) {
        throw new Error("Không tìm thấy nhân viên để xóa.");
      }

      // Nếu cả hai xóa thành công
      await session.commitTransaction();
      res.status(200).json({
        message: "Nhân viên và thông tin xác thực đã được xóa thành công.",
      });
    } catch (error) {
      // Nếu có lỗi, hủy bỏ transaction
      await session.abortTransaction();
      res.status(400).json({ message: error.message });
    } finally {
      session.endSession();
    }
  }
}

module.exports = EmployeeController;
