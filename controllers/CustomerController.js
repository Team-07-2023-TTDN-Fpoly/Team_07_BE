const Customer = require("../models/CustomerSchema.js");
const mongoose = require("mongoose");
const validator = require("validator"); // dùng để kiểm tra dữ liệu
// lỗi
const { formatCustomerData } = require("../utils/FormatCustomerData.js");
const CustomerController = {
  // Thêm khách hàng mới
  createCustomer: async (req, res) => {
    try {
      const {
        cus_name,
        cus_phone,
        cus_phoneSecond,
        cus_email,
        cus_wedding_date,
        cus_address,
      } = req.body;

      // Validate số điện thoại
      if (!cus_phone || !validator.isLength(cus_phone, { min: 10, max: 10 })) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }

      // Validate email
      if (!cus_email || !validator.isEmail(cus_email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }
      // Validate tên khách hàng
      if (!cus_name || cus_name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Tên khách hàng không được để trống." });
      }
      // Tạo khách hàng mới
      const customer = new Customer({
        cus_name,
        cus_phone,
        cus_phoneSecond,
        cus_email,
        cus_wedding_date,
        cus_address,
      });

      // Lưu khách hàng vào cơ sở dữ liệu
      await customer.save();

      res.status(201).json({ data: customer._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //Update khách hàng
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        cus_name,
        cus_phone,
        cus_phoneSecond,
        cus_email,
        cus_wedding_date,
        cus_address,
      } = req.body;

      // Validate tên khách hàng
      if (!cus_name || cus_name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Tên khách hàng không được để trống." });
      }

      // Validate số điện thoại
      if (!cus_phone || !validator.isLength(cus_phone, { min: 10, max: 10 })) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }

      // Validate số điện thoại 2
      if (
        cus_phoneSecond &&
        !validator.isLength(cus_phoneSecond, { min: 10, max: 10 })
      ) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
      }

      // Validate email
      if (cus_email && !validator.isEmail(cus_email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }

      const customer = await Customer.findByIdAndUpdate(
        id,
        {
          cus_name,
          cus_phone,
          cus_phoneSecond,
          cus_email,
          cus_wedding_date,
          cus_address,
        },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({ message: "Khách hàng không tồn tại" });
      }

      res.status(200).json({ message: "Thay đổi thông tin thành công!" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //Tìm khách hàngn theo ID
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);

      if (!customer || customer.hidden) {
        return res.status(404).json({ message: "Khách hàng không tồn tại" });
      }

      const customerData = formatCustomerData(customer);

      res.status(200).json({ data: customerData });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy danh sách tất cả khach hang
  getAllCustomers: async (req, res) => {
    const { search } = req.query;
    try {
      let query = { hidden: false };
      //Tìm kiếm theo tên
      if (search) {
        query.cus_name = { $regex: search, $options: "i" }; // 'i' không phân biệt hoa thường
      }
      //
      // Lấy tất cả bản ghi từ Customer
      const customerList = await Customer.find(query);

      // Xây dựng danh sách khách hàng
      const formattedCustomerList = customerList.map((customer) => {
        return formatCustomerData(customer);
      });

      res.status(200).json({ data: formattedCustomerList });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Xóa khách hàng
  // Lấy thông tin một nhân viên theo ID
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      // Xóa khách hàng
      const customerDeletionResult = await Customer.findByIdAndUpdate(
        id,
        { hidden: true },
        { new: true }
      );
      if (!customerDeletionResult) {
        throw new Error("Không tìm thấy khách hàng để xóa.");
      }
      res.status(200).json({
        message: "Khách hàng đã được xóa thành công.",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = CustomerController;
