const mongoose = require("mongoose");
const HealthRecord = require("./HealthRecord");  
const User = require("./User");  

const StudentSchema = new mongoose.Schema(
  {
    SID: { type: String, unique: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
    name: { type: String },
    age: { type: Number },
    branch: { type: String },
    batch: { type: Number },
    healthRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" }], 
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
  if (!this.SID) {
    const lastStudent = await mongoose.model("Student").findOne({}, {}, { sort: { SID: -1 } });
    let lastNumber = lastStudent ? parseInt(lastStudent.SID.replace("STU", ""), 10) : 0;

    if (lastNumber >= 9999) {
      return next(new Error("Maximum student limit reached (9999)"));
    }

    this.SID = `STU${String(lastNumber + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
