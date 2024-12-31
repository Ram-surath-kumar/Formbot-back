const User = require("../../models/User");
const Space = require("../../models/Space");

const checkAccess = async (req, res, next) => {
  try {
    const userId = req.userId;
    const spaceId = req.params.spaceId;
    // Validate if the space exists
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: true, message: "Space not found" });
    }

    // Validate if the user has access to the space
    const user = await User.findById(userId).select("spaces");
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found!" });
    }

    const userSpace = user.spaces.find((space) => {
      return space.space.toString() === spaceId;
    });

    if (!userSpace) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this space!",
      });
    }

    // If the method is not GET, ensure the user has edit permissions
    if (req.method !== "GET" && !userSpace.canEdit) {
      return res.status(403).json({
        error: true,
        message: "You do not have edit permissions for this space",
      });
    }

    next();
  } catch (error) {
    console.log("Error checking access:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error!" });
  }
};

module.exports = checkAccess;
