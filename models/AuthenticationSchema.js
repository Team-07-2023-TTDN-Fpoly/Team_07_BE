  const mongoose = require("mongoose");

  const authenticationSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
      },
      hash_password: {
        type: String,
        required: true,
        maxlength: 255,
      },
      salt: {
        type: String,
        required: true,
        maxlength: 250,
      },
      emp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", //Tham chiếu tới bảng Employee
      },
      is_disable: {
        type: String,
        require: true,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  const Authentication = mongoose.model("Authentication", authenticationSchema);

  module.exports = Authentication;
