import mongoose from "mongoose";
import Authentication from "./Authentication.js";
import { connectDB } from "../config/db.js";

// connectDB();

const serviceSeekerSchema = new mongoose.Schema({
  authID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authentication",
    required: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "others"],
  },
  homeAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Phone number must be a 10-digit number",
    },
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const serviceSeekerModel = mongoose.model("ServiceSeeker", serviceSeekerSchema);

export default serviceSeekerModel;
