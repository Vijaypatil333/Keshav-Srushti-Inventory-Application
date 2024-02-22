const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createAllProductController,
  deleteAllProductsController,
  getAllProductsController,
  getSearchedAllProductsController,
  getBufferedProductsController,
} = require("../controllers/allProductsController");

const router = express.Router();

//routes
//add product || post
router.post("/create-all-products", authMiddleware, createAllProductController);

//delete product
router.delete(
  "/delete-all-products/:_id",
  authMiddleware,
  deleteAllProductsController
);

//get all records
router.get("/get-all-products", authMiddleware, getAllProductsController);

//get searched all records
router.get(
  "/get-all-products/:searchQuery",
  authMiddleware,
  getSearchedAllProductsController
);

//get buffered records
router.get(
  "/get-buffered-products",
  authMiddleware,
  getBufferedProductsController
);

module.exports = router;
