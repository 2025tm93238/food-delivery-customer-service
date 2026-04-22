const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address_id: { type: Number, required: true, unique: true },
  customer_id: { type: Number, required: true },
  line1: { type: String, required: true },
  area: { type: String },
  city: { type: String, required: true },
  pincode: { type: String },
  created_at: { type: Date },
});

module.exports = mongoose.model("Address", addressSchema);
