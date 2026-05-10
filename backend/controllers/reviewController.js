
import Review from '../models/Review.js';
import Company from '../models/Company.js';

export const getReviewsByCompany = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = {};

    if (sort === 'rating_high') {
      sortOption = { rating: -1 };
    } else if (sort === 'rating_low') {
      sortOption = { rating: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({
      company: req.params.companyId
    }).sort(sortOption);

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const {
      company,
      fullName,
      subject,
      reviewText,
      rating
    } = req.body;

    const review = await Review.create({
      company,
      fullName,
      subject,
      reviewText,
      rating
    });

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

