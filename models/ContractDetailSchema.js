const mongoose = require("mongoose");

const contractDetailSchema = new mongoose.Schema(
  {
    dress_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dress",
    },
    return_date: {
      type: Date,
      require: true,
    },
    rental_date: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const contractDetail = mongoose.model("ContractDetail", contractDetailSchema);

module.exports = contractDetail;
