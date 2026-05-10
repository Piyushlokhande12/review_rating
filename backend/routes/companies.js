import express from "express";

const router = express.Router();

import {
  getCompanies,
  getCompany,
  createCompany
} from "../controllers/companyController.js";

import upload from "../middleware/upload.js";
// GET all companies
router.get("/", getCompanies);

// GET single company
router.get("/:id", getCompany);

// CREATE company
router.post("/",upload.single("logo"), createCompany);

export default router;