const mongoose = require("mongoose");

const dressTypeSchema = new  mongoose.Schema(
  {
    type_name: { type: String, required: true, maxlength: 50 },
  },
  {
    timestamps: true,
  }
);

const DressType = mongoose.model("DressType", dressTypeSchema);

module.exports = DressType;
