import Authentication from "../models/Authentication.js";
import ServiceSeeker from "../models/serviceSeeker.js";
import ServiceProvider from "../models/serviceProvider.js";
import ServicePosting from "../models/servicePostings.js";

export const createServicePosting = async (req, res) => {
  const {
    serviceSeekerID,
    serviceType,
    serviceDescription,
    address,
    proposedPayment,
    workDuration,
    serviceStatus,
    applicantIDs,
    selectedProviderIDs,
    pplRequired,
    priority,
    geolocation,
  } = req.body;

  const latitude = geolocation.latitude;
  const longitude = geolocation.longitude;

  try {
    const serviceSeeker = await ServiceSeeker.findById(serviceSeekerID);
    if (!serviceSeeker) {
      return res.status(404).json({ message: "Service Seeker not found" });
    }

    const newServicePosting = new ServicePosting({
      serviceSeekerID,
      serviceType,
      serviceDescription,
      proposedPayment,
      workDuration,
      address,
      serviceStatus,
      applicantIDs,
      selectedProviderIDs,
      pplRequired,
      priority,
      geolocation: {
        type: "Point", // Must be 'Point'
        coordinates: [longitude, latitude], // [longitude, latitude]
      },
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

export const searchServicePosting = async (req, res) => {
  const nearbyProviders = req.nearbyProviders; // Accessing nearby providers from the middleware

  // Extract the provider IDs from nearbyProviders
  const providerIDs = nearbyProviders.map((provider) => provider.providerID);

  try {
    // Fetch services where selectedProviderIDs matches any of the nearby provider IDs
    const services = await ServicePosting.find({
      selectedProviderIDs: { $in: providerIDs }, // Filter services based on nearby providers
    });

    // If no services are found
    if (services.length === 0) {
      return res.status(404).json({ message: "No nearby services found." });
    }

    // Return the nearby services
    res.status(200).json({
      message: "Nearby services retrieved successfully.",
      services,
    });
  } catch (error) {
    console.error("Error retrieving services:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
