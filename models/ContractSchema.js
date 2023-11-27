const mongoose = require("mongoose");
const contractDetailSchema = require("./ContractDetailSchema");
const contractSchema = new mongoose.Schema(
  {
    cus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    emp_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    contract_details: [contractDetailSchema],
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
