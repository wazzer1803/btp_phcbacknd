const express = require("express");
const { 
  getHealthRecordsByStudent, 
  updateStudentDetails 
} = require("../controllers/studentController");  

const router = express.Router();


router.get("/health-records/:userId", getHealthRecordsByStudent);


router.put("/update/:userId", updateStudentDetails);

module.exports = router;
