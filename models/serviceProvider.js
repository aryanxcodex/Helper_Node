import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
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
  serviceType: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
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
  serviceLocation: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    type: Number,  //No. of Hours
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  geolocation: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const serviceProviderModel = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

export default serviceProviderModel;
