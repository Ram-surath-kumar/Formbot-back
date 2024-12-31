const Space = require("../../models/Space");
const jwt = require("jsonwebtoken");

const generateInvite = async (req, res) => {
  try {
    const { spaceId, access } = req.query;
    const userId = req.userId;

    if (!["view", "edit"].includes(access)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid access type. Must be "view" or "edit".',
      });
    }
    const space = await Space.findOne({ _id: spaceId, owner: userId });
    if (!space) {
      return res.status(400).json({
        error: true,
        message:
          "Space not found or you do not have permission to share this space.",
      });
    }
    const token = jwt.sign({ spaceId, access }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Error generating invite link:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to generate invite link. Please try again.",
    });
  }
};

module.exports = generateInvite;