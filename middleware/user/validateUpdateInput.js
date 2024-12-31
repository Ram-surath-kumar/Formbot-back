const { body, validationResult } = require("express-validator");

const validateUpdateInput = async (req, res, next) => {
  for (let key in req.body) {
    if (!req.body[key]?.trim()) {
      delete req.body[key];
    }
  }
  // checking if the user has provided a password or new password
  const hasPassword = !!req.body.password;
  const hasNewPassword = !!req.body.newPassword;

  if (hasPassword && !hasNewPassword) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a new password!" }); // if the user has provided a password but not new password
  }

  if (!hasPassword && hasNewPassword) {
    return res
      .status(400)
      .json({ error: true, message: "Old Password is required!" });
  }

  await body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .customSanitizer(value => value.toLowerCase())
    .run(req);

  await body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[a-zA-Z])/)
    .withMessage("Password must be Alphanumeric!")
    .run(req);

  await body("newPassword")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[a-zA-Z])/)
    .withMessage("Password must be Alphanumeric!")
    .run(req);

  await body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .run(req);

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: error.array()[0].msg,
    });
  }
  // Move to the next middleware or route handler if validation passes
  next();
};

module.exports = validateUpdateInput;
