const Customer = require("../models/CustomerSchema.js");
const Authentication = require("../models/AuthenticationSchema.js");
const mongoose = require("mongoose");
const validator = require("validator"); // dùng để kiểm tra dữ liệu
// lỗi
const CustomerController = {
  // Thêm khách hàng mới
  createCustomerAndUser: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Kiểm tra email tồn tại trong Authentication
      const { email, ...customerData } = req.body;

      // Validate tên nhân viên
      if (validator.isEmpty(customerData.cus_name)) {
        return res
          .status(400)
          .json({ message: "Tên nhân viên không được để trống." });
      }

      // Validate số điện thoại
      if (!validator.isLength(customerData.cus_phone, { min: 10, max: 10 })) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }
      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }
    
      const existingUser = await Authentication.findOne({
        email: email,
      }).session(session);
      if (existingUser) {
        throw new Error("Email đã tồn tại");
      }

      // Tạo Employee mới
      const customer = await new Customer(customerData).save({ session });

      await session.commitTransaction();
      res.status(201).json({ data: customer._id });
    } catch (error) {
      // Nếu có lỗi, hủy bỏ transaction
      await session.abortTransaction();
      res.status(400).json({ message: error.message });
    } finally {
      session.endSession();
    }
  },

  // Cập nhật thông tin nhân viên
  // updateCustomer: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { ...customerData } = req.body;
  //     // Validate tên nhân viên
  //     if (validator.isEmpty(customerData.cus_name)) {
  //       return res
  //         .status(400)
  //         .json({ message: "Tên nhân viên không được để trống." });
  //     }

  //     // Validate số điện thoại
  //     if (!validator.isLength(customerData.cus_phone, { min: 10, max: 10 })) {
  //       return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
  //     }
  //     // Validate email
  //     if (!validator.isEmail(email)) {
  //       return res.status(400).json({ message: "Email không hợp lệ." });
  //     }

  //     // Validate password (ví dụ: độ dài tối thiểu là 6)
  //     if (!validator.isLength(password, { min: 6 })) {
  //       return res
  //         .status(400)
  //         .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  //     }
  //     //validaotr lương
  //     if (validator.isEmpty(customerData.basic_salary)) {
  //       return res.status(400).json({ message: "Vui lòng nhập lương." });
  //     }
  //     const employee = await Employee.findByIdAndUpdate(id, customerData, {
  //       new: true,
  //     });
  //     if (!employee) {
  //       return res.status(404).json({ message: "Nhân viên không tồn tại" });
  //     }
  //     res.status(200).json({ message: "Thay đổi thông tin thành công!" });
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },

  // Lấy thông tin một nhân viên theo ID
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const auth = await Authentication.findOne({ cus_id: id }).populate(
        "cus_id"
      );
      if (!auth) {
        return res
          .status(404)
          .json({ message: "Thông tin xác thực không tồn tại" });
      }
      // auth.emp_id sẽ chứa thông tin đầy đủ của nhân viên
      const customerData = {
        ...auth.cus_id.toObject(), // Chuyển document mongoose thành plain object
        auth_id: auth._id,
        cus_id: auth.cus_id._id,
        email: auth.email, // Email từ Authentication
        is_disabled: auth.is_disable,
        sdt2: req.body.sdt2,
        ngay_sinh: req.body.ngay_sinh,
        dia_chi: req.body.dia_chi // Trạng thái từ Authentication
      };
      res.status(200).json({ data: customerData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy danh sách tất cả nhân viên
  // getAllCustomers: async (req, res) => {
  //   try {
  //     // Lấy tất cả bản ghi từ Authentication và populate thông tin Employee
  //     const authList = await Authentication.find().populate({
  //       path: "cus_id",
  //       select:
  //         "cus_name cus_phone cus_address cus_birthday role workShiftId join_date basic_salary", // chỉ định các trường bạn muốn lấy từ Employee
  //     });

  //     // Xây dựng danh sách thông tin nhân viên với thông tin xác thực
  //     const employeeList = authList.map((auth) => {
  //       const customerData = auth.cus_id ? auth.cus_id.toObject() : {};
  //       return {
  //         ...customerData,
  //         auth_id: auth._id,
  //         cus_id: auth.cus_id ? auth.cus_id._id : null,
  //         email: auth.email, // Email từ Authentication
  //         is_disabled: auth.is_disable, // Trạng thái từ Authentication
  //       };
  //     });

  //     res.status(200).json({ data: employeeList });
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },

  //Xóa nhân viên
  // Lấy thông tin một nhân viên theo ID
  // deleteCustomer: async (req, res) => {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   try {
  //     const { id } = req.params;

  //     // Xóa thông tin xác thực liên quan
  //     const authDeletionResult = await Authentication.findOneAndDelete({
  //       cus_id: id,
  //     }).session(session);
  //     if (!authDeletionResult) {
  //       throw new Error("Không tìm thấy thông tin xác thực để xóa.");
  //     }

  //     // Xóa nhân viên
  //     const employeeDeletionResult = await Employee.findByIdAndDelete(
  //       id
  //     ).session(session);
  //     if (!employeeDeletionResult) {
  //       throw new Error("Không tìm thấy nhân viên để xóa.");
  //     }

  //     // Nếu cả hai xóa thành công
  //     await session.commitTransaction();
  //     res.status(200).json({
  //       message: "Nhân viên và thông tin xác thực đã được xóa thành công.",
  //     });
  //   } catch (error) {
  //     // Nếu có lỗi, hủy bỏ transaction
  //     await session.abortTransaction();
  //     res.status(400).json({ message: error.message });
  //   } finally {
  //     session.endSession();
  //   }
  // },
};

module.exports = CustomerController;
