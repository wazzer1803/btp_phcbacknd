const Doctor = require("../models/Doctor");  
const HealthRecord = require("../models/HealthRecord");  

exports.getHealthRecordsByDoctor = async (req, res, next) => {
  try {
    const { userId } = req.params;  
    
    const doctor = await Doctor.findOne({ user: userId }).populate('prescribedRecords');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Health records fetched successfully", healthRecords: doctor.prescribedRecords });
  } catch (error) {
    next(error);  
  }
};


exports.updateDoctorDetails = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const { name, age, specialization, experience } = req.body; 

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (name) doctor.name = name;
    if (age) doctor.age = age;
    if (specialization) doctor.specialization = specialization;
    if (experience) doctor.experience = experience;

    await doctor.save(); 

    res.status(200).json({ message: "Doctor details updated successfully", doctor });
  } catch (error) {
    next(error);
  }
};
