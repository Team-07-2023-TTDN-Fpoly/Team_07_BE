const mongoose = require("mongoose");

const workShiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    timeStart: {
      type: Date,
      require: true,
    },
    timeEnd: {
      type: Date,
      require: true,
    },
    shift_description: {
      type: String,
      default: "",
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WorkShift = mongoose.model("WorkShift", workShiftSchema);

module.exports = WorkShift;
