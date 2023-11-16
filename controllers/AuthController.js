const Authentication = require("../models/AuthenticationSchema.js");
const bcrypt = require("bcryptjs");

const AuthenticationController = {
  // Hàm cho người quản lý thay đổi mật khẩu nhân viên
  adminChangePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const auth = await Authentication.findById(id);
      if (!auth) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      // Tạo hash mới cho mật khẩu mới
      const salt = bcrypt.genSaltSync(10);
      const hash_password = bcrypt.hashSync(newPassword, salt);

      auth.hash_password = hash_password;
      auth.salt = salt;
      await auth.save();

      res
        .status(200)
        .json({ message: "Mật khẩu đã được thay đổi thành công." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Hàm disable tài khoản
  disableAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { disable } = req.body; // Giá trị boolean để biết là disable hay enable tài khoản

      const user = await Authentication.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      user.is_disable = disable;
      await user.save();

      res.status(200).json({
        message: `Tài khoản đã được ${
          disable ? "vô hiệu hóa" : "kích hoạt"
        } thành công.`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AuthenticationController;
