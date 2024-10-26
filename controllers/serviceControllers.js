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

export const searchServicePosting = async (req, res) => {};

export const applyService = async (req, res) => {
  const { serviceID, serviceProviderID } = req.body;

  if (!serviceID || !serviceProviderID) {
    return res
      .status(400)
      .json({ message: "Service ID and Service Provider ID are required" });
  }

  try {
    const serviceProvider = await ServiceProvider.findOne({
      authID: serviceProviderID,
    });

    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    const servicePosting = await ServicePosting.findById(serviceID);
    if (!servicePosting) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (servicePosting.applicantIDs.includes(serviceProviderID)) {
      return res.status(400).json({
        message: "Service provider has already applied for this service",
      });
    }

    servicePosting.applicantIDs.push(serviceProviderID);
    await servicePosting.save();

    res.status(200).json({
      message: "Applied to the service successfully",
      servicePosting,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveServiceProvider = async (req, res) => {
  const { serviceID, serviceProviderID } = req.body;

  if (!serviceID || !serviceProviderID) {
    return res
      .status(400)
      .json({ message: "Service ID and Service Provider ID are required" });
  }

  try {
    const serviceProvider = await ServiceProvider.findOne({
      authID: serviceProviderID,
    });

    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    const servicePosting = await ServicePosting.findById(serviceID);
    if (!servicePosting) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (!servicePosting.applicantIDs.includes(serviceProviderID)) {
      return res
        .status(400)
        .json({ message: "Service provider has not applied for this service" });
    }

    if (servicePosting.selectedProviderIDs.includes(serviceProviderID)) {
      return res.status(400).json({
        message: "Service provider is already approved for this service",
      });
    }

    servicePosting.selectedProviderIDs.push(serviceProviderID);

    // Optional: Update the service status
    servicePosting.serviceStatus = "in progress";

    await servicePosting.save();

    res.status(200).json({
      message: "Service provider approved successfully",
      servicePosting,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
