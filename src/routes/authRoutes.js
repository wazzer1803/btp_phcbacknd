const express = require("express");
const { loginUser, signupUser,bulkSignupUsers } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);
router.post("/bulk-signup", bulkSignupUsers);

module.exports = router;
