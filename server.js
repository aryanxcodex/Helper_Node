import express from "express";
import dotenv from "dotenv";
import Authentication from "./models/Authentication.js";
import ServiceSeeker from "./models/serviceSeeker.js";
import ServiceProvider from "./models/serviceProvider.js";
import Contractor from "./models/contractor.js";
import ServicePosting from "./models/servicePostings.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World! This is your Express backend.");
});

// app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});