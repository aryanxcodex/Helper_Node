import Authentication from "../models/Authentication.js";
import ServiceSeeker from "../models/serviceSeeker.js";
import ServiceProvider from "../models/serviceProvider.js";
import Contractor from "../models/contractor.js";
import ServicePosting from "../models/servicePostings.js"; 

export const createServicePosting = async (req, res) => {
  const {
    serviceSeekerID,
    serviceType,
    serviceDescription,
    geolocation,
    proposedPayment,
    workDuration,
    serviceStatus,
    applicantIDs,
    selectedProviderIDs,
    pplRequired,
    priority,
  } = req.body;

  try {
    const serviceSeeker = await ServiceSeeker.findById(serviceSeekerID);
    if (!serviceSeeker) {
      return res.status(404).json({ message: "Service Seeker not found" });
    }

    const newServicePosting = new ServicePosting({
      serviceSeekerID,
      serviceType,
      serviceDescription,
      geolocation,
      proposedPayment,
      workDuration,
      serviceStatus,
      applicantIDs, 
      selectedProviderIDs, 
      pplRequired,
      priority,
    });

    const savedServicePosting = await newServicePosting.save();

    res.status(201).json({
      message: "Service posting created successfully",
      servicePosting: savedServicePosting,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
