const mongoose = require("mongoose");
const HealthRecord = require("./HealthRecord");  
const User = require("./User");  

const DoctorSchema = new mongoose.Schema(
  {
    DID: { type: String, unique: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String},
    age: { type: Number }, 
    specialization: { type: String }, 
    experience: { type: Number }, 
    prescribedReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" }], 
  },
  { timestamps: true }
);

DoctorSchema.pre("save", async function (next) {
  if (!this.DID) {
    const lastDoctor = await mongoose.model("Doctor").findOne({}, {}, { sort: { DID: -1 } });
    let newDID = "DOC001";
    if (lastDoctor && lastDoctor.DID) {
      const lastNumber = parseInt(lastDoctor.DID.replace("DOC", ""), 10);
      newDID = `DOC${String(lastNumber + 1).padStart(3, "0")}`;
    }
    this.DID = newDID;
  }
  next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);
