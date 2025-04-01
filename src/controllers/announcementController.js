
const Announcement = require("../models/Announcements");

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, category, createdBy, createdFor } = req.body;

    const newAnnouncement = new Announcement({
      title,
      message,
      category,
      createdBy,
      createdFor,
    });

    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedAnnouncement) {
      return next({ status: 404, message: "Announcement not found" });
    }

    res.json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return next({ status: 404, message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "email")
      .populate("createdFor", "email");

    res.status(200).json({ announcements });
  } catch (error) {
    next(error);
  }
};

exports.getUserAnnouncements = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userAnnouncements = await Announcement.find({ createdFor: userId })
      .populate("createdBy", "email")
      .populate("createdFor", "email");

    if (!userAnnouncements.length) {
      return next({ status: 404, message: "No announcements found for this user" });
    }

    res.status(200).json({ announcements: userAnnouncements });
  } catch (error) {
    next(error);
  }
};
