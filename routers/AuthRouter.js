const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController.js");
const AuthMiddleware = require("../middleware/AuthMiddleware.js");
const AdminMiddleware = require("../middleware/AdminMiddleware.js");

//quản lý thay đổi mật khẩu nhân viên
router.put(
  "/change/password/:id",
  AuthMiddleware,
  AdminMiddleware,
  AuthController.adminChangePassword
);
router.put(
  "/change/disable/:id",
  AuthMiddleware,
  AdminMiddleware,
  AuthController.disableAccount
);
//đăng nhập tài khoản
router.post("/login", AuthController.loginAccount);
module.exports = router;
