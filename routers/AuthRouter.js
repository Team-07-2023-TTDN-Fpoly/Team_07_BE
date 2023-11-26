const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController.js");

//quản lý thay đổi mật khẩu nhân viên
router.put("/change/password/:id", AuthController.adminChangePassword);
router.put("/change/disable/:id", AuthController.disableAccount);
//đăng nhập tài khoản
router.post("/login", AuthController.loginAccount);
module.exports = router;
