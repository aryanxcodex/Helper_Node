import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authentication",
    required: true,
  },
  forUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authentication",
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
    trim: true,
  },
  serviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServicePosting", 
    required: false, 
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  summarizedKeypoints: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
