const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

async function connect() {
  try {
    await mongoose.connect(mongoURI);
    console.log("kết nối với MongoDB thành công!");
  } catch (err) {
    console.error("Không thể kết nối với MongoDB", err);
    process.exit(1); // Thoát với mã lỗi nếu không thể kết nối
  }
}

module.exports = connect;
