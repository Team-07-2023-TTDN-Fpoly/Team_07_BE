async function AdminMiddleware(req, res, next) {
  if (req.session.user.role != "Quản lý") {
    return res.status(401).json({ message: "Bạn không có quyền hạn" });
  }
  next();
}

module.exports = AdminMiddleware;
