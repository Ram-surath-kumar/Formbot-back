const User = require("../../models/User");
require("dotenv").config();

const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("-__v -createdAt -updatedAt -password")
      .populate({
        path: "spaces.space",
        select: "name",
      })
      .lean();

    if (!user) {
      return res.status(401).json({ error: true, message: "User not found" });
    }

    // Sort spaces array so the owner's space comes first
    user.spaces.sort((a, b) => {
      if (a.isOwner && !b.isOwner) return -1;
      if (!a.isOwner && b.isOwner) return 1;
      return 0;
    });

    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user details", error);
    return res
      .status(500)
      .json({ error: true, message: "Error retrieving user details" });
  }
};

module.exports = getUserDetails;
