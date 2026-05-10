import Company from "../models/Company.js";
import Review from "../models/Review.js";

export const getCompanies = async (req, res) => {
  try {
    const { search, city, sort } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    let sortOption = {};

    if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (sort === 'reviews') {
      sortOption = { totalReviews: -1 };
    } else {
      sortOption = { name: 1 };
    }

    const companies = await Company.find(query).sort(sortOption);

    res.json({
      success: true,
      count: companies.length,
      data: companies
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const createCompany = async (req, res) => {
  try {
    const { name, address, city, foundedOn, logoColor } = req.body;

    const initials = name[0].toUpperCase(); 
    
    const logo = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const company = await Company.create({
      name,
      address,
      city,
      foundedOn,
      logoColor: logoColor ,
      logoInitials: initials,
      logo
    });

    res.status(201).json({
      success: true,
      data: company
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

