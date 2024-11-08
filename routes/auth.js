import express from "express";
import * as ctrls from "../controllers/index.js";
import { body, validationResult } from "express-validator";
const routes = express.Router();
routes.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric"),
  ],
  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Received username:", username);
    console.log("Received password:", password);
    const results = validationResult(req);
    if (!results.isEmpty()) return res.status(422).json({ errors: results.array() });
    next();
  },
  ctrls.login
);
routes.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not correct")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric"),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required")
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) return res.status(422).json({ errors: results.array() });
    next();
  },
  ctrls.register
);
routes.post(
  "/login-admin",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric"),
  ],
  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Received username:", username);
    console.log("Received password:", password);
    const results = validationResult(req);
    if (!results.isEmpty()) return res.status(422).json({ errors: results.array() });
    next();
  },
  ctrls.loginAdmin
);

export default routes;
