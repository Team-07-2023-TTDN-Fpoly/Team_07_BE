const mongoose = require("mongoose");
const contractSchema = new mongoose.Schema(
  {
    cus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authentication",
    },
    contract_details: [
      {
        type: mongoose.Schema.Types.ObjectId, // Thay đổi kiểu dữ liệu này
        ref: "ContractDetail", // Tham chiếu đến model ContractDetail
      },
    ],
    createAt: {
      type: Date,
      require: true,
    },
    endAt: {
      type: Date,
      require: true,
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    prepay: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    contract_status: {
      type: String,
      default: "Chưa thanh toán",
    },
    contract_description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const contract = mongoose.model("Contract", contractSchema);

module.exports = contract;
