const mongoose = require("mongoose");

const DetailStatisticsSchema = new mongoose.Schema(
  {
    dt_date: {
      type: Date,
      default: null,
    },
    dt_name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    dt_money: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    dt_text: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DetailStatistics = mongoose.model(
  "DetailStatistic",
  DetailStatisticsSchema
);

module.exports = DetailStatistics;
