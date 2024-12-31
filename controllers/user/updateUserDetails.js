const User = require("../../models/User");
const Space = require("../../models/Space");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found" });
    }
    const { name, email, password, newPassword } = req.body;
    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({
        error: true,
        message: "User with current email already exists",
      });
    }

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: true, message: "Old password is incorrect!" });
      }
    }

    if (name) {
      user.name = name;
      await Space.findOneAndUpdate(
        { owner: user._id },
        { name: `${name}'s Space` }
      );
    }
    if (email) {
      user.email = email;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    user = await User.findOne({ _id: userId })
      .select("-__v -createdAt -updatedAt -password")
      .populate({
        path: "spaces.space",
        select: "name",
      })
      .lean();
    return res.status(200).json({
      success: true,
      data: user,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error("Error updating user details", error);
    return res
      .status(500)
      .json({ error: true, message: "Error updating user details" });
  }
};

module.exports = updateUserDetails;
