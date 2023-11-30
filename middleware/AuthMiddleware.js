async function AuthMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Chưa đăng nhập tài khoản" });
  }
  next();
}

module.exports = AuthMiddleware;
