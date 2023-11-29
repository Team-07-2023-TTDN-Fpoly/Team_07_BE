const mongoose = require("mongoose");

const dressTypeSchema = new mongoose.Schema(
  {
    type_name: { type: String, required: true, maxlength: 50 },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DressType = mongoose.model("DressType", dressTypeSchema);

module.exports = DressType;
