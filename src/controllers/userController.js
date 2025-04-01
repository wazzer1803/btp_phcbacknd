const User = require("../models/User"); 

exports.getUserData = async (req, res, next) => {
  try {
    const { userId } = req.params; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
