const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");

router.post("/", announcementController.createAnnouncement);
router.put("/:id", announcementController.updateAnnouncement);
router.delete("/:id", announcementController.deleteAnnouncement);
router.get("/", announcementController.getAllAnnouncements);
router.get("/user/:userId", announcementController.getUserAnnouncements);

module.exports = router;
