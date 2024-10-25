import express from "express";
import {
  registerUser,
  loginUser,
  sendOTP,
} from "../controllers/userControllers.js";
import { verifyOTP } from "../middleware/verifyOtp.js";
const router = express.Router();

router.route("/register").post(verifyOTP, registerUser);
router.route("/login").post(loginUser);
router.route("/send-otp").post(sendOTP);

export default router;
