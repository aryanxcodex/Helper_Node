import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Authentication from "./models/Authentication.js";
// import ServiceSeeker from "./models/serviceSeeker.js";
// import ServiceProvider from "./models/serviceProvider.js";
// import Contractor from "./models/contractor.js";
// import ServicePosting from "./models/servicePostings.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
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
app.use("/api/job", jobRoutes);

// app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
