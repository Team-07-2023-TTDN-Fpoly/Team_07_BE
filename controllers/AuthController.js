const Authentication = require("../models/AuthenticationSchema.js");
const bcrypt = require("bcryptjs");
const { formatEmployeeData } = require("../utils/FormatEmployeeData.js");
class AuthenticationController {
  // Hàm cho người quản lý thay đổi mật khẩu nhân viên
  static async adminChangePassword(req, res) {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
      const auth = await Authentication.findById(id);
      if (!auth) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }
      // Tạo hash mới cho mật khẩu mới
      const salt = bcrypt.genSaltSync(10);
      const hash_password = bcrypt.hashSync(newPassword, salt);

      auth.hash_password = hash_password;
      await auth.save();
      res
        .status(200)
        .json({ message: "Mật khẩu đã được thay đổi thành công." });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  // Hàm disable tài khoản
  static async disableAccount(req, res) {
    try {
      const { id } = req.params;
      const { disable } = req.body; // Giá trị boolean để biết là disable hay enable tài khoản

      const user = await Authentication.findByIdAndUpdate(id, {
        is_disable: disable,
      });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      res.status(200).json({
        message: `Tài khoản đã thay đổi thành công.`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
  //Hàm thay đổi mật khẩu cá nhân
  static async changePassword(req, res) {
    const { oldPassword, newPassword, checkPassword } = req.body;
    try {
      //Kiểm tra thông tin nhập vào
      if (!oldPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu!" });
      }
      if (!newPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới!" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải từ 6 kí tự trở lên!" });
      }
      if (!checkPassword || newPassword != checkPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng xác nhận lại mật khẩu mới!" });
      }

      //Lấy thông tin
      const user = await Authentication.findOne({ emp_id: req.session.userId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tài khoản đăng nhập!" });
      }
      if (!(await bcrypt.compare(oldPassword, user.hash_password))) {
        return res
          .status(404)
          .json({ message: "Mật khẩu cũ không chính xác!" });
      }
      // Tạo hash_password và salt
      const salt = await bcrypt.genSalt(16);
      const hash_password = await bcrypt.hash(newPassword, salt);

      await Authentication.findByIdAndUpdate(user._id, {
        hash_password: hash_password,
      });

      res.status(200).json({ message: "Thay đổi mật khẩu thành công!" });
    } catch (error) {
      console.log("Lỗi khi đổi mật khẩu bản thân", error);
      res.status(400).json({ message: error.message });
    }
}


  // Đăng nhập tài khoản
  static async loginAccount(req, res) {
    const { email, password } = req.body;
    console.log(req.body)
    try {
      //check email
      const auth = await Authentication.findOne({ email: email });
      if (!auth) {
        return res.status(401).json({ message: "Email không đúng." });
      }
      //check mật khẩu
      const check = await bcrypt.compare(password, auth.hash_password);
      if (!check) {
        return res.status(401).json({ message: "Mật khẩu không đúng." });
      }

      // Kiểm tra xem tài khoản có bị vô hiệu hóa không
      if (auth.is_disable) {
        return res
          .status(400)
          .json({ message: "Tài khoản của bạn đã bị vô hiệu hóa!" });
      }

      const user = await auth.populate({
        path: "emp_id",
        model: "Employee",
        populate: {
          path: "workShiftId",
          model: "WorkShift",
        },
      });
      // Nếu tài khoản hợp lệ, lưu thông tin nhân viên vào session
      const employeeData = formatEmployeeData(user);
      req.session.user = employeeData;
      res.status(200).json({ data: employeeData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập." });
    }
  }
}
module.exports = AuthenticationController;
