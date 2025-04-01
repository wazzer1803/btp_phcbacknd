


const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
    maxQuantity: { type: Number, required: true },
    currentLeft: { type: Number, required: true },
    restockingRequired: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);



module.exports = mongoose.model("Inventory", InventorySchema);
