import Authentication from "../models/Authentication.js";
import ServiceSeeker from "../models/serviceSeeker.js";
import ServiceProvider from "../models/serviceProvider.js";
import Contractor from "../models/contractor.js";

export const registerUser = async (req, res) => {
  const {
    userType,
    phoneNumber,
    fullname,
    age,
    gender,
    homeAddress,
    additionalInfo,
  } = req.body;

  try {
    const auth = new Authentication({
      userType,
      phoneNumber,
    });

    const authRecord = await auth.save();

    let userProfile;

    if (userType === "ServiceSeeker") {
      userProfile = new ServiceSeeker({
        authID: authRecord._id,
        fullname,
        age,
        gender,
        homeAddress,
        phoneNumber,
      });
    } else if (userType === "ServiceProvider") {
      userProfile = new ServiceProvider({
        authID: authRecord._id,
        fullname,
        age,
        gender,
        serviceLocation: additionalInfo.serviceLocation,
        experience: additionalInfo.experience,
        availability: additionalInfo.availability,
        hourlyRate: additionalInfo.hourlyRate,
        address: homeAddress,
        geolocation: additionalInfo.geolocation,
        serviceType: additionalInfo.serviceType,
        skills: additionalInfo.skills,
        phoneNumber,
      });
    } else if (userType === "Contractor") {
      userProfile = new Contractor({
        authID: authRecord._id,
        fullname,
        companyName: additionalInfo.companyName,
        type: additionalInfo.type,
        gender,
        address: additionalInfo.address || homeAddress,
      });
    } else {
      return res.status(400).json({ message: "Invalid user type provided" });
    }

    const savedUserProfile = await userProfile.save();

    res.status(201).json({
      message: `${userType} registered successfully`,
      userProfile: savedUserProfile,
      authID: authRecord._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};