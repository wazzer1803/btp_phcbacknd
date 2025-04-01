const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/ScheduleController");

router.post("/create", ScheduleController.createSchedule);
router.put("/update/:scheduleId", ScheduleController.updateSchedule);
router.delete("/delete/:scheduleId", ScheduleController.deleteSchedule);
router.get("/all", ScheduleController.getAllSchedules);
router.get("/doctor/:doctorId", ScheduleController.getDoctorSchedules);

module.exports = router;
