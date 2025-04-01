const express = require("express");
const router = express.Router();
const healthRecordController = require("../controllers/healthRecordController");

router.post("/", healthRecordController.createHealthRecord);


// router.put("/:recordId", healthRecordController.updateHealthRecord);

router.delete("/:recordId", healthRecordController.deleteHealthRecord);

router.get("/", healthRecordController.getAllHealthRecords);

router.get("/student/:studentId", healthRecordController.getHealthRecordsByStudent);

router.get("/doctor/:doctorId", healthRecordController.getHealthRecordsByDoctor);

module.exports = router;
