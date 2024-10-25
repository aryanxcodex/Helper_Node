import Authentication from "../models/Authentication.js";

export const verifyOTP = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res
      .status(400)
      .json({ message: "phoneNumber and OTP are required" });
  }

  try {
    const authRecord = await Authentication.findOne({ phoneNumber });

    if (!authRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    // const currentTime = new Date();
    if (authRecord.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
