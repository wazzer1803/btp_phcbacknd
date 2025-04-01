




const Schedule = require("../models/Schedule");
const User = require("../models/User");

exports.createSchedule = async (req, res, next) => {
  try {
    const { createdFor, date, startTime, endTime } = req.body;

    const user = await User.findById(createdFor);
    if (!user || user.userType !== "doctor") {
      return next({ status: 400, message: "Only doctors can have schedules" });
    }

    const newSchedule = new Schedule({ createdFor, date, startTime, endTime });
    await newSchedule.save();

    res.status(201).json({ message: "Schedule created successfully", schedule: newSchedule });
  } catch (error) {
    next(error); 
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, updates, { new: true });

    if (!updatedSchedule) return next({ status: 404, message: "Schedule not found" });

    res.json({ message: "Schedule updated successfully", schedule: updatedSchedule });
  } catch (error) {
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!deletedSchedule) return next({ status: 404, message: "Schedule not found" });

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find().populate("createdFor", "email userType");
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

exports.getDoctorSchedules = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const doctorSchedules = await Schedule.find({ createdFor: doctorId }).populate("createdFor", "email userType");

    if (!doctorSchedules.length) {
      return next({ status: 404, message: "No schedules found for this doctor" });
    }

    res.json(doctorSchedules);
  } catch (error) {
    next(error);
  }
};
