import { validationResult, body } from "express-validator";
export const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  } else {
    res.status(400).send({ errors: validationErrors.array() });
  }
};

export const userValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("first name is required.")
    .isAlpha("de-DE", { ignore: " -" })
    .withMessage("First name contains illegal characters ")
    .trim(),

  body("lastName")
    .notEmpty()
    .withMessage("last name is required.")
    .isAlpha("de-DE", { ignore: " -" })
    .withMessage("last name contains illegal characters ")
    .trim(),

  // body("lastName").trim().escape().isLength({ min: 5 }).escape(),

  body("email")
    .notEmpty()
    .withMessage("Email must be provided")
    .trim()
    .isEmail()
    .withMessage("Email format is invalid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password must be specified.")
    .trim()
    // .isStrongPassword() // auskommentiert zum einfacheren Testen
    .withMessage(
      "Password is not secure. It should contain at least eight characters, including at least one lowercase letter, at least one uppercase letter, at least one number and at least one special character."
    ),
];

export const userUpdateValidator = [
  body("firstName")
    .optional()
    .isAlpha("de-DE", { ignore: " -" })
    .withMessage("First name contains illegal characters ")
    .trim(),
];
