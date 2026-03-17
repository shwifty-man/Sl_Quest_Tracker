import { body } from "express-validator";

export const hunterNameValidation = [
  body("newName")
    .trim()
    .notEmpty()
    .withMessage("Hunter name is required")
    .isLength({ min: 2, max: 10 })
    .withMessage("Hunter name must be between 2 and 30 characters"),
];
