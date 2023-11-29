const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    cus_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    cus_phone: {
      type: String,
      required: true,
    },
    cus_phoneSecond: {
      type: String,
      required: true,
    },
    cus_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    cus_wedding_date: {
      type: Date,
      default: null,
    },
    cus_address: {
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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
