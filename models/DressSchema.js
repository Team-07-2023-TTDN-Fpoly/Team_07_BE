const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dressSchema = new Schema(
  {
    dress_name: { type: String, required: true },
    dressTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "DressType" },
    dress_price: { type: Number, required: true },
    size: { type: String, maxLength: 10 },
    color: { type: String, maxLength: 50 },
    dress_image: { type: String }, // Assuming this is a URL or path to an image
    dress_description: { type: String, default: "" },
    dress_status: { type: String, default: "Sẵn sàng" },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Dress = mongoose.model("Dress", dressSchema);

module.exports = Dress;
