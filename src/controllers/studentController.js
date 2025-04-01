const Student = require("../models/Student");  
const HealthRecord = require("../models/HealthRecord");  

exports.getHealthRecordsByStudent = async (req, res, next) => {
  try {
    const { userId } = req.params; 

    const student = await Student.findOne({ user: userId }).populate("healthRecords");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Health records fetched successfully",
      studentName: student.name,
      healthRecords: student.healthRecords,
    });
  } catch (error) {
    next(error); 
  }
};


exports.updateStudentDetails = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const { name, age, branch, batch } = req.body; 

    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (name) student.name = name;
    if (age) student.age = age;
    if (branch) student.branch = branch;
    if (batch) student.batch = batch;

 
    await student.save();

    res.status(200).json({
      message: "Student details updated successfully",
      student,
    });
  } catch (error) {
    next(error); 
  }
};

