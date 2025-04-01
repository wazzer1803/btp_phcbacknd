const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, enum: ["general", "event", "urgent", "reminder"], default: "general" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdFor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", AnnouncementSchema);
