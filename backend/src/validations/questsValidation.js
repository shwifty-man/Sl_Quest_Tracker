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

    .withMessage("Quest title must be between 4 and 20 characters"),


  body("questData.time")

    .trim()

    .notEmpty()

    .withMessage("Quest time is required"),


  body("questData.deadline")

    .trim()

    .notEmpty()

    .withMessage("Quest deadline is required"),


  body("questData.type")

    .trim()

    .notEmpty()

    .withMessage("Quest type is required")

    .isIn(["Daily", "Weekly", "One-time"])

    .withMessage(
      "Quest type must be one of: Daily, Weekly, One-time"
    ),


  body("questData.questDescription")

    .trim()

    .notEmpty()

    .withMessage("Quest description is required")

    .isLength({ min: 4, max: 50 })

    .withMessage("Quest description must be between 4 and 50 characters"),


  body("questData.difficulty")

    .notEmpty()

    .withMessage("Difficulty is required")

    .isIn(["Easy", "Meduim", "Hard", "Extreme"])

    .withMessage("Difficulty must what I set"),

];