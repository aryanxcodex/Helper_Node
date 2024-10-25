import mongoose from "mongoose";

const authenticationSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: ["ServiceSeeker", "ServiceProvider", "Contractor"],
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

const Authentication = mongoose.model("Authentication", authenticationSchema);

export default Authentication;
