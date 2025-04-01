const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");
const Doctor = require("../models/Doctor");
const Student = require("../models/Student");

cloudinary.config({
  cloud_name: "ds19r43kd",
  api_key: "666654244182493",
  api_secret: "WAYhqgCOiPNjlw5n3PX1gjAWkLo",
});

const generateReport = async (healthRecord) => {
  const doctor = await Doctor.findOne({ user: healthRecord.createdBy }).select("name specialization");
  const student = await Student.findOne({ user: healthRecord.createdFor }).select("name age branch batch");

  const doc = new PDFDocument({ margin: 50 });
  const tempFilePath = path.join(__dirname, "../tmp", `report_${healthRecord._id}.pdf`);
  doc.pipe(fs.createWriteStream(tempFilePath));

doc.fontSize(22).font("Helvetica-Bold").text("PDPM IIITDM", { align: "center" });
  doc.fontSize(20).font("Helvetica-Bold").text("Health Record Report", { align: "center" });

  doc.moveDown();
  doc.fontSize(14).font("Helvetica").text(`Date: ${healthRecord.date.toLocaleDateString()}`, { align: "left" });
  doc.text(`Time: ${healthRecord.time}`, { align: "left" });

  if (student) {
    doc.fontSize(14).font("Helvetica-Bold").text("Patient Information:", { align: "left" });
    doc.fontSize(12).font("Helvetica").text(`Name: ${student.name}`, { align: "left" });
    doc.text(`Age: ${student.age}`, { align: "left" });
    doc.text(`Branch: ${student.branch}`, { align: "left" });
    doc.text(`Batch: ${student.batch}`, { align: "left" });
  }

 if (doctor) {
    doc.moveDown();
    doc.fontSize(14).font("Helvetica-Bold").text("Doctor Information:", { align: "left" });
    doc.fontSize(12).font("Helvetica").text(`Name: ${doctor.name}`, { align: "left" });
    doc.text(`Specialization: ${doctor.specialization || "Not specified"}`, { align: "left" });
  }

  doc.moveDown();
  doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  if (healthRecord.conditions && healthRecord.conditions.length > 0) {
    doc.fontSize(14).font("Helvetica-Bold").text("Conditions:", { align: "left" });
    healthRecord.conditions.forEach((condition, index) => {
      doc.fontSize(12).font("Helvetica").text(`${index + 1}. ${condition}`, { align: "left" });
    });
  }

  doc.moveDown();
  doc.fontSize(14).font("Helvetica-Bold").text("Dosage:", { align: "left" });

  await Promise.all(
    healthRecord.dosage.map(async (item, index) => {
      const product = await Product.findById(item.product).select("name PID");
      if (product) {
        doc.fontSize(12).font("Helvetica").text(`${index + 1}. ${product.name} (PID: ${product.PID}): ${item.quantity}`, { align: "left" });
      }
    })
  );

  doc.moveDown();
  doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
  doc.fontSize(10).font("Helvetica").text("PDPM IIITDM, Jabalpur", { align: "center" });
  doc.text("Address: Jabalpur, Madhya Pradesh, India", { align: "center" });

  doc.end();

  await new Promise((resolve) => doc.on("end", resolve));

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "health-records",
      resource_type: "auto",
      access_control: [{ access_type: "anonymous" }],
    });

    fs.unlinkSync(tempFilePath);

    return result.secure_url; 
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("PDF upload failed");
  }
};

module.exports = { generateReport };
