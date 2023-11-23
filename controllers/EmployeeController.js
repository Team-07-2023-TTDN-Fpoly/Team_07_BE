const Employee = require("../models/EmployeeSchema.js");
const Authentication = require("../models/AuthenticationSchema.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator"); // dùng để kiểm tra dữ liệu

class EmployeeController {
  // Thêm nhân viên mới
  static async createEmployeeAndUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { email, password, ...employeeData } = req.body;
    try {
      // Kiểm tra email tồn tại trong Authentication

      // Validate tên nhân viên
      if (validator.isEmpty(employeeData.emp_name)) {
        return res
          .status(400)
          .json({ message: "Tên nhân viên không được để trống." });
      }

      // Validate số điện thoại
      if (!validator.isLength(employeeData.emp_phone, { min: 10, max: 10 })) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }
      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }

      // Validate password (ví dụ: độ dài tối thiểu là 6)
      if (!validator.isLength(password, { min: 6 })) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
      }
      //validaotr lương
      if (isNaN(employeeData.basic_salary)) {
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
      console.log("Create", employee);
      // Tạo hash_password và salt
      const salt = bcrypt.genSaltSync(16);
      const hash_password = bcrypt.hashSync(password, salt);

      // Tạo Authentication mới
      await new Authentication({
        email,
        hash_password,
        salt,
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
      console.log(req.body);
      console.log(id);
      // Validate tên nhân viên
      if (validator.isEmpty(employeeData.emp_name)) {
        return res
          .status(400)
          .json({ message: "Tên nhân viên không được để trống." });
      }

      // Validate số điện thoại
      if (!validator.isLength(employeeData.emp_phone, { min: 10, max: 10 })) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }
      //validaotr lương
      if (isNaN(employeeData.basic_salary)) {
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
      const employeeData = {
        emp_name: auth.emp_name,
        emp_phone: auth.emp_phone,
        emp_address: auth.emp_address,
        emp_birthday: auth.emp_birthday,
        role: auth.role,
        join_date: auth.join_date,
        basic_salary: auth.basic_salary,
        workShift: {
          shift_id: auth.workShiftId._id,
          name: auth.workShiftId.name,
          timeStart: auth.workShiftId.timeStart,
          timeEnd: auth.workShiftId.timeEnd,
          shift_description: auth.workShiftId.shift_description,
        },
        auth_id: auth._id,
        emp_id: auth.emp_id ? auth.emp_id._id : null,
        email: auth.email, // Email từ Authentication
        is_disable: auth.is_disable, // Trạng thái từ Authentication
      };
      res.status(200).json({ data: employeeData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Lấy danh sách tất cả nhân viên
  static async getAllEmployees(req, res) {
    try {
      // Lấy tất cả bản ghi từ Authentication và populate thông tin Employee
      const authList = await Authentication.find().populate({
        path: "emp_id",
        select:
          "emp_name emp_phone emp_address emp_birthday role workShiftId join_date basic_salary", // chỉ định các trường bạn muốn lấy từ Employee
        populate: {
          path: "workShiftId",
          model: "WorkShift",
        },
      });
      // Xây dựng danh sách thông tin nhân viên với thông tin xác thực
      const employeeList = authList.map((auth) => {
        const employeeData = auth.emp_id ? auth.emp_id.toObject() : {};
        return {
          emp_name: employeeData.emp_name,
          emp_phone: employeeData.emp_phone,
          emp_address: employeeData.emp_address,
          emp_birthday: employeeData.emp_birthday,
          role: employeeData.role,
          join_date: employeeData.join_date,
          basic_salary: employeeData.basic_salary,
          workShift: {
            shift_id: employeeData.workShiftId._id,
            name: employeeData.workShiftId.name,
            timeStart: employeeData.workShiftId.timeStart,
            timeEnd: employeeData.workShiftId.timeEnd,
            shift_description: employeeData.workShiftId.shift_description,
          },
          auth_id: auth._id,
          emp_id: auth.emp_id ? auth.emp_id._id : null,
          email: auth.email, // Email từ Authentication
          is_disable: auth.is_disable, // Trạng thái từ Authentication
        };
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
