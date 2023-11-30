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
      console.log("Lỗi khi quản lý thay đổi mật khẩu", error);
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
      console.log(`Lỗi vô hiệu hóa tài khoản`, error);

      res.status(400).json({ message: error.message });
    }
  }
  // Đăng nhập tài khoản
  static async loginAccount(req, res) {
    try {
      const { email, password } = req.body;
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
          .status(403)
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
      //Lưu thông tin vào session
      req.session.userId = employeeData.emp_id;
      //
      res.status(200).json({ data: employeeData });
    } catch (error) {
      console.log(`Lỗi đăng nhập`, error);

      return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập." });
    }
  }
}
module.exports = AuthenticationController;
