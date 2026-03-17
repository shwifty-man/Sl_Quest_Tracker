import { body } from "express-validator";

export const createQuestValidation = [
  body("questData")
    .exists({ checkNull: true })
    .withMessage("Quest data is required")
    .bail()
    .isObject()
    .withMessage("Quest data must be an object"),

  body("questData.questTitle")
    .trim()
    .notEmpty()
    .withMessage("Quest title is required")
    .isLength({ min: 4, max: 20 })
    .withMessage("Quest title must be 20 characters or less"),

  body("questData.type")
    .trim()
    .notEmpty()
    .withMessage("Quest type is required")
    .isIn(["Workout", "Study", "Reading", "Meditation"])
    .withMessage("Quest type must be one of: Workout, Study, Reading, Meditation"),

  body("questData.unitName")
    .trim()
    .notEmpty()
    .withMessage("Unit name is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("Unit name must be 50 characters or less"),

  body("questData.targetValue")
    .notEmpty()
    .withMessage("Target value is required")
    .isInt({ min: 1 })
    .withMessage("Target value must be an integer greater than 0"),
];
