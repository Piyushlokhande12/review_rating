import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    reviewText: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    likes: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);