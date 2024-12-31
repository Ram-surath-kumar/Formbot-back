const Space = require("../../models/Space");

const getSpace = async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    // Fetch the space details
    const getSpace = await Space.findById(spaceId)
      .select("-__v")
      .populate({
        path: "rootFolder",
        options: { sort: { createdAt: -1 } },
        select: "-__v -updatedAt",
        populate: {
          path: "children",
          options: { sort: { createdAt: -1 } },
          select: "-__v -updatedAt",
        },
        populate: {
          path: "responses",
          options: { sort: { submittedAt: -1 } },
          select: "-__v -updatedAt",
        },
      });

    if (!getSpace) {
      return res.status(404).json({ error: true, message: "Space not found!" });
    }

    return res.status(200).json({ success: true, data: getSpace });
  } catch (error) {
    console.log("Error getting space:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error!" });
  }
};

module.exports = getSpace;
