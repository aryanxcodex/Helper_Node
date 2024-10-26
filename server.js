import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Authentication from "./models/Authentication.js";
// import ServiceSeeker from "./models/serviceSeeker.js";
// import ServiceProvider from "./models/serviceProvider.js";
// import Contractor from "./models/contractor.js";
// import ServicePosting from "./models/servicePostings.js";
import Feedback from "./models/Feedback.js";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import cookieParser from "cookie-parser";
import axios from "axios";
import { connectDB } from "./config/db.js";

dotenv.config();

const corsOptions = {
  origin: "https://helperr-app.vercel.app/",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
connectDB();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", userRoutes);
app.use("/api/service", serviceRoutes);
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const callRouteContinuously = async () => {
  try {
    const response = await axios.get("http://localhost:3000/");
    console.log("Response received:", response.data);
  } catch (error) {
    console.error("Error calling route:", error.message);
  } finally {
    setTimeout(callRouteContinuously, 300000);
  }
};

callRouteContinuously();
