import mongoose from "mongoose";

const servicePostingSchema = new mongoose.Schema({
  serviceSeekerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceSeeker", 
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
    required: true,
    trim: true,
  },
  geolocation: {
    type: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    required: false,
  },
  proposedPayment: {
    type: Number,
    required: true,
    min: 0,
  },
  workDuration: {
    type: String,
    required: true,
    trim: true,
  },
  serviceStatus: {
    type: String,
    required: true,
    enum: ["open", "in progress", "completed", "closed"],
  },
  applicantIDs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ServiceProvider",
    default: [],
  },
  selectedProviderIDs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ServiceProvider",
    default: [],
  },
  pplRequired: {
    type: Number,
    required: true,
    min: 1,
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const servicePostingModel = mongoose.model("ServicePosting", servicePostingSchema);

export default servicePostingModel;
