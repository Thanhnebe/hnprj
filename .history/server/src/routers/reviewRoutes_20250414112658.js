const express = require('express');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyMiddleware');
const reviewRouter = express.Router();

reviewRouter.post('/', verifyToken, addReview);
reviewRouter.get('/:productId', getProductReviews);

module.exports = reviewRouter;