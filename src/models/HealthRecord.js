
const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema(
  {
    createdFor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    dosage: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
        quantity: { type: Number, required: true }, 
      },
    ],
    conditions: [{ type: String, required: true }], 
    reportLink: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);
