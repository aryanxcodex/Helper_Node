import express from "express";
import {
  registerUser,
  loginUser,
  sendOTP,
} from "../controllers/userControllers.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/send-otp").post(sendOTP);

export default router;