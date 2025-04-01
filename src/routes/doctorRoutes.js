const express = require("express");
const { getHealthRecordsByDoctor,updateDoctorDetails } = require("../controllers/doctorController");  

const router = express.Router();

router.get("/health-records/:userId", getHealthRecordsByDoctor);

router.put("/update/:userId", updateDoctorDetails);


module.exports = router;
