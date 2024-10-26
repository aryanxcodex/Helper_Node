import ServiceProvider from "../models/serviceProvider.js";

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const findNearbyProviders = async (req, res, next) => {
  const { latitude, longitude } = req.body;
  const maxDistance = 5000;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required." });
  }

  try {
    const providers = await ServiceProvider.find({
      geolocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    const nearbyProviders = providers.map((provider) => ({
      providerID: provider._id,
      distance: getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        provider.geolocation.coordinates[1],
        provider.geolocation.coordinates[0]
      ),
    }));

    req.nearbyProviders = nearbyProviders;

    next();
  } catch (error) {
    console.error("Error finding nearby providers:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export default findNearbyProviders;
