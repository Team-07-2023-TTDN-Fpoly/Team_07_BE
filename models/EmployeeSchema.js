const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    emp_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    emp_phone: {
      type: String,
      required: true,
    },
    emp_address: {
      type: String,
      default: "",
    },
    emp_birthday: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      require: true,
    },
    workShiftId: {
      type: mongoose.Schema.Types.ObjectId, // Kieu ObjectId cho cac tham chieu
      ref: "WorkShift", // Tham chiếu đến model 'WorkShift'
    },
    join_date: {
      type: Date,
      default: Date.now,
    },
    basic_salary: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
