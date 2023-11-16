const EmployeeModel = require("../models/EmployeeModel");

async function AdminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).send("Chưa đăng nhập tài khoản");
  }
  if (!req.user.role !== "Admin") {
    return res.status(403).send("Bạn không có quyền!");
  }
  next();
}

module.exports = AdminMiddleware;
