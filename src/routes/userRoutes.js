const express = require("express");
const { getUserData } = require("../controllers/userController");

const router = express.Router();

router.get("/:userId", getUserData);

module.exports = router;
