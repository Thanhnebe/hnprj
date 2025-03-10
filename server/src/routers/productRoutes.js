const express = require("express");
const ProductRouter = express.Router();
const { getTopSellingProducts, getAllCategories, searchAndFilterProducts ,getProductDetails} = require("../controllers/productController");

ProductRouter.get("/top-selling", getTopSellingProducts);
ProductRouter.get("/categories", getAllCategories);
ProductRouter.get("/getvafiller", searchAndFilterProducts);
ProductRouter.get("/:productId", getProductDetails);

module.exports = ProductRouter;