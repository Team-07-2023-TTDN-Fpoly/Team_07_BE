const Employee = require("../models/EmployeeSchema.js");
async function AdminMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Bạn chựa đăng nhập tài khoản" });
  }
  const employee = await Employee.findById(req.session.userId);
  if (!employee) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin người dùng." });
  }

  if (employee.role !== "Quản lý") {
    return res
      .status(403)
      .json({ message: "Bạn không đủ quyền hạn thực hiện công việc này!" });
  }
  next();
}

module.exports = AdminMiddleware;
