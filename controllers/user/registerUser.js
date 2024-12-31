const User = require("../../models/User");
const Space = require("../../models/Space");
const FolderOrForm = require("../../models/FormOrFolder");
const generateToken = require("../../utils/generateToken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user ps:dont save it yet
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      spaces: [],
    });

    // Create a new space for the user (no need to add a root folder initially)
    const newSpace = new Space({
      owner: newUser._id,
      name: `${name}'s workspace`,
      rootFolder: [],
    });

    // Add the space reference to the user's spaces array
    newUser.spaces.push({
      space: newSpace._id,
      canEdit: true,
      isOwner: true,
    });

    // Save the space and user to the database
    await newSpace.save();
    await newUser.save();

    // Generate a token for the user
    const token = await generateToken(newUser._id);

    const user = await User.findOne({ email })
      .select("-__v -createdAt -updatedAt -password")
      .populate({
        path: "spaces.space",
        select: "name",
      })
      .lean();

    return res.status(200).json({
      message: "User created successfully",
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.log("error while registering user", error);
    res
      .status(500)
      .json({ error: true, message: "Error while registering user" });
  }
};

module.exports = registerUser;
