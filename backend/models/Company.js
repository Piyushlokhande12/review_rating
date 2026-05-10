import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      default: ""
    },
    logoColor: {
      type: String,
      default: "#1a1a2e"
    },
    logoInitials: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    foundedOn: {
      type: String,
      required: true
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);