const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    PID: { type: String, unique: true }, 
    name: { type: String, required: true, unique: true },
    productType: {
      type: String,
      enum: ["medicine", "equipment", "miscellaneous"],
      required: true,
    },
    recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

ProductSchema.pre("save", async function (next) {
  if (!this.PID) {
    const lastProduct = await this.constructor.findOne().sort({ createdAt: -1 }); 
    let nextPID = "PID001";

    if (lastProduct && lastProduct.PID) {
      const lastNumber = parseInt(lastProduct.PID.replace("PID", ""), 10);
      nextPID = `PID${String(lastNumber + 1).padStart(3, "0")}`;
    }

    this.PID = nextPID;
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
