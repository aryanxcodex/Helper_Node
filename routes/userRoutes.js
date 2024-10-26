import express from "express";
import {
  registerUser,
  loginUser,
  sendOTP,
  getProfile,
  postFeedback,
} from "../controllers/userControllers.js";
import { verifyOTP } from "../middleware/verifyOtp.js";
import { getCoordinatesMiddleware } from "../middleware/geoCoding.js";
const router = express.Router();

router
  .route("/register")
  .post(verifyOTP, getCoordinatesMiddleware, registerUser);
router.route("/login").post(verifyOTP, loginUser);
router.route("/send-otp").post(sendOTP);
router.route("/getProfile").post(getProfile);
router.route("/postFeedback").post(postFeedback);

export default router;
