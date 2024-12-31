const { body, validationResult } = require("express-validator");

const validateUser = async (req, res, next) => {
  await body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .customSanitizer((value) => value.toLowerCase())
    .run(req);

  await body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[a-zA-Z])/)
    .withMessage("Password must be Alphanumeric!")
    .run(req);

  await body("confirmPassword")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[a-zA-Z])/)
    .withMessage("Password must be Alphanumeric!")
    .run(req);

  await body("name")
    .optional()
    .trim()
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

module.exports = validateUser;
