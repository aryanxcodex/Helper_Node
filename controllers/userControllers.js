import Authentication from "../models/Authentication.js";
import ServiceSeeker from "../models/serviceSeeker.js";
import ServiceProvider from "../models/serviceProvider.js";
import Contractor from "../models/contractor.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const registerUser = async (req, res) => {
  const body = req.body;

  try {
    let authRecord = await Authentication.findOne({
      phoneNumber: body.phoneNumber,
    });

    if (!authRecord) {
      authRecord = new Authentication({
        userType: body.userType,
        phoneNumber: body.phoneNumber,
      });

      await authRecord.save();
    }

    let userProfile;

    if (body.userType === "ServiceSeeker") {
      userProfile = new ServiceSeeker({
        authID: authRecord._id,
        fullname: body.fullname,
        age: body.age,
        gender: body.gender,
        homeAddress: body.homeAddress,
        phoneNumber: body.phoneNumber,
      });
    } else if (body.userType === "ServiceProvider") {
      userProfile = new ServiceProvider({
        authID: authRecord._id,
        fullname: body.fullname,
        age: body.age,
        gender: body.gender,
        experience: body.experience,
        availability: body.availability,
        hourlyRate: body.hourlyRate,
        address: body.homeAddress,
        serviceAddress: body.serviceAddress,
        geolocation: body.geolocation,
        serviceType: body.serviceType,
        skills: body.skills,
        phoneNumber: body.phoneNumber,
      });
    } else if (body.userType === "Contractor") {
      userProfile = new Contractor({
        authID: authRecord._id,
        fullname: body.fullname,
        companyName: body.companyName,
        type: body.type,
        gender: body.gender,
        address: body.address,
      });
    } else {
      return res.status(400).json({ message: "Invalid user type provided" });
    }

    const savedUserProfile = await userProfile.save();

    res.status(201).json({
      message: `${body.userType} registered successfully`,
      userProfile: savedUserProfile,
      authID: authRecord._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { userType, phoneNumber } = req.body;

  if (!userType || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "userType and phoneNumber are required" });
  }

  try {
    const authRecord = await Authentication.findOne({ phoneNumber });

    if (!authRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    let userProfile;

    if (userType === "ServiceSeeker") {
      userProfile = await ServiceSeeker.findOne({ authID: authRecord._id });
    } else if (userType === "ServiceProvider") {
      userProfile = await ServiceProvider.findOne({ authID: authRecord._id });
    } else if (userType === "Contractor") {
      userProfile = await Contractor.findOne({ authID: authRecord._id });
    } else {
      return res.status(400).json({ message: "Invalid user type provided" });
    }

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({
      message: `${userType} logged in successfully`,
      userProfile,
      authID: authRecord._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const sendOTP = async (req, res) => {
  const { userType, phoneNumber } = req.body;

  if (!userType || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "userType and phoneNumber are required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    let authRecord = await Authentication.findOne({ phoneNumber });

    if (!authRecord) {
      authRecord = new Authentication({
        userType,
        phoneNumber,
        otp,
      });
    } else {
      authRecord.otp = otp;
    }

    await authRecord.save();

    axios
      .get(
        `https://2factor.in/API/V1/${process.env.OTPCRED}/SMS/+91${phoneNumber}/${otp}/OTP1`
      )
      .then((response) => {
        console.log("OTP sent", response.data);
      })
      .catch((error) => {
        console.error("Error Sending OTP", error.message);
      });

    res.status(200).json({ message: "OTP generated and sent to your phone." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating OTP.", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { authID } = req.params;

  if (!authID) {
    return res.status(400).json({ message: "authID is required" });
  }

  try {
    const authRecord = await Authentication.findById(authID);
    if (!authRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    let userProfile;

    // Fetch the user profile based on user type
    if (authRecord.userType === "ServiceSeeker") {
      userProfile = await ServiceSeeker.findOne({ authID });
    } else if (authRecord.userType === "ServiceProvider") {
      userProfile = await ServiceProvider.findOne({ authID });
    } else if (authRecord.userType === "Contractor") {
      userProfile = await Contractor.findOne({ authID });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const postFeedback = async (req, res) => {
  const {
    userID,
    forUserID,
    feedbackText,
    serviceID,
    rating,
    summarizedKeypoints,
  } = req.body;

  if (!userID || !forUserID || !feedbackText || !rating) {
    return res.status(400).json({
      message: "userID, forUserID, feedbackText, and rating are required.",
    });
  }

  try {
    const feedback = new Feedback({
      userID,
      forUserID,
      feedbackText,
      serviceID,
      rating,
      summarizedKeypoints,
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      message: "Feedback posted successfully",
      feedback: savedFeedback,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
