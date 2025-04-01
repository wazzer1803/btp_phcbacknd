const { generateReport } = require("../services/pdfService");
const HealthRecord = require("../models/HealthRecord");
const Inventory = require("../models/Inventory");
const Student = require("../models/Student");
const Doctor = require("../models/Doctor");
const path = require("path");
const Product = require("../models/Product");


exports.createHealthRecord = async (req, res, next) => {
  try {
    const { createdFor, createdBy, date, time, dosageProducts, dosageQuantities, conditions } = req.body;

    if (!Array.isArray(dosageProducts) || !Array.isArray(dosageQuantities)) {
      return res.status(400).json({ message: "Dosage products and quantities must be arrays" });
    }
    if (dosageProducts.length !== dosageQuantities.length) {
      return res.status(400).json({ message: "Products and quantities arrays must have the same length" });
    }

    const products = await Product.find({ _id: { $in: dosageProducts } }).select("name PID");

    if (products.length !== dosageProducts.length) {
      return res.status(404).json({ message: "One or more products not found" });
    }

    const dosage = dosageProducts.map((productId, index) => {
      const product = products.find(p => p._id.toString() === productId);
      return {
        product: {
          _id: product._id,
          
        },
        quantity: dosageQuantities[index],
      };
    });

    const newRecord = new HealthRecord({
      createdFor,
      createdBy,
      date,
      time,
      dosage,
      conditions,
    });

    await newRecord.save();

    for (let i = 0; i < dosage.length; i++) {
      const productId = dosage[i].product._id;
      const quantityToReduce = dosage[i].quantity;

      const inventory = await Inventory.findOne({ product: productId });
      if (!inventory) {
        return res.status(404).json({ message: `Inventory not found for product ${productId}` });
      }
      if (inventory.currentLeft < quantityToReduce) {
        return res.status(400).json({ message: `Not enough stock for product ${productId}` });
      }

      inventory.currentLeft -= quantityToReduce;
      await inventory.save();
    }

    await Student.updateOne(
      { user: createdFor },
      { $push: { healthRecords: newRecord._id } }
    );

    await Doctor.updateOne(
      { user: createdBy },
      { $push: { prescribedReports: newRecord._id } }
    );

    const reportPath = await generateReport(newRecord);
    newRecord.reportLink = reportPath;  
    await newRecord.save();

    res.status(201).json({
      message: "Health record created successfully",
      record: newRecord,
    });

  } catch (error) {
    next(error);
  }
};



// exports.updateHealthRecord = async (req, res, next) => {
//   try {
//     const { recordId } = req.params;
//     const updates = req.body;

//     const updatedRecord = await HealthRecord.findByIdAndUpdate(recordId, updates, { new: true });

//     if (!updatedRecord) return res.status(404).json({ message: "Health record not found" });

//     res.json({ message: "Health record updated successfully", record: updatedRecord });
//   } catch (error) {
//     next(error);
//   }
// };

// ✅ Delete Health Record


exports.deleteHealthRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;

    const deletedRecord = await HealthRecord.findByIdAndDelete(recordId);
    if (!deletedRecord) return res.status(404).json({ message: "Health record not found" });

    res.json({ message: "Health record deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllHealthRecords = async (req, res, next) => {
  try {
    const records = await HealthRecord.find()
      .populate("createdFor", "name age") 
      .populate("createdBy", "name specialization"); 

    res.json(records);
  } catch (error) {
    next(error);
  }
};

exports.getHealthRecordsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const studentRecords = await HealthRecord.find({ createdFor: studentId })
      .populate("createdBy", "name specialization");

    if (!studentRecords.length) {
      return res.status(404).json({ message: "No health records found for this student" });
    }

    res.json(studentRecords);
  } catch (error) {
    next(error);
  }
};

exports.getHealthRecordsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    const doctorRecords = await HealthRecord.find({ createdBy: doctorId })
      .populate("createdFor", "name age");

    if (!doctorRecords.length) {
      return res.status(404).json({ message: "No health records found for this doctor" });
    }

    res.json(doctorRecords);
  } catch (error) {
    next(error);
  }
};
