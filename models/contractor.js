import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema({
  authID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authentication",
    required: true,
  },
  fullname: {
    type: String,
    required: false,
    trim: true,
  },
  companyName: {
    type: String,
    required: false,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Individual", "Organisation"],
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female", "others"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  feedBackSummary: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const contractorModel = mongoose.model("Contractor", contractorSchema);

export default contractorModel;
