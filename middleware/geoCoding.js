import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getCoordinatesMiddleware = async (req, res, next) => {
  const address = req.body.homeAddress || req.body.address;
  const { userType } = req.body;

  if(userType != "ServiceProvider") {
    next();
  }

  if (!address) {
    return res.status(400).json({ message: "Address is required." });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      req.geolocation = { latitude: location.lat, longitude: location.lng };
      next();
    } else {
      return res
        .status(404)
        .json({ message: "No results found for the provided address." });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching coordinates", error: error.message });
  }
};
