import express from "express";
import {
  getReviewsByCompany,
  createReview
} from "../controllers/reviewController.js";

const router = express.Router();

// GET reviews by company
router.get("/company/:companyId", getReviewsByCompany);

// CREATE review
router.post("/", createReview);

export default router;