const User = require("../../models/User");
const Space = require("../../models/Space");
const jwt = require("jsonwebtoken");

const shareSpace = async (req, res) => {
  try {
    const { token } = req.query;
    const userId = req.userId;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { spaceId, access } = decoded;
      if (!spaceId || !access) {
        return res.status(400).json({
          error: true,
          message: "Invalid token: Missing required claims",
        });
      }

      const space = await Space.findById(spaceId);
      if (!space) {
        return res
          .status(400)
          .json({ error: true, message: "Space not found or access denied" });
      }

      if (String(space.owner) === String(userId)) {
        return res.status(400).json({
          error: true,
          message:
            "You already have full access. Sharing with yourself is not allowed.",
        });
      }

      const user = await User.findById(userId);

      const existingSpace = user.spaces.find(
        (space) => space.space.toString() === spaceId.toString()
      );

      if (existingSpace) {
        existingSpace.canEdit = access === "edit";
      } else {
        user.spaces.push({ space: spaceId, canEdit: access === "edit" });
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Access granted with ${access} permissions.`,
      });
    } else {
      
      const { email, access, spaceId } = req.body;
      if (!email || !access || !spaceId) {
        return res.status(400).json({
          error: true,
          message: "Missing required fields: email, spaceId, or access.",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: true, message: "User does not exist" });
      }

      if (String(user._id) === String(userId)) {
        return res.status(400).json({
          error: true,
          message:
            "You already have full access. Sharing with yourself is not allowed!",
        });
      }

      const existingSpace = user.spaces.find(
        (space) => space.space.toString() === spaceId.toString()
      );

      if (existingSpace) {
        existingSpace.canEdit = access === "edit";
      } else {
        user.spaces.push({ space: spaceId, canEdit: access === "edit" });
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Access granted with ${access} permissions.`,
      });
    }
  } catch (error) {
    console.error("Error sharing space", error);
    return res
      .status(500)
      .json({ error: true, message: "Error sharing space" });
  }
};

module.exports = shareSpace;
