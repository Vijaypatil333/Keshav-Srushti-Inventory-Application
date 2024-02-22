const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createBufferedProductsController,
  deleteBufferedProductsController,
  getBufferedProductsController,
  getSearchedBufferedProductsController,
  deleteBufferedProductsByNameController,
} = require("../controllers/bufferedProductsController");

const router = express.Router();

//routes
//add buffer product || post
router.post(
  "/create-buffered-products",
  authMiddleware,
  createBufferedProductsController
);

//delete buffer product
router.delete(
  "/delete-buffered-products/:_id",
  authMiddleware,
  deleteBufferedProductsController
);

//delete by name
router.delete(
  "/delete-buffered-products",
  authMiddleware,
  deleteBufferedProductsByNameController
);

//get all records
router.get(
  "/get-buffered-products",
  authMiddleware,
  getBufferedProductsController
);

//get searched records
router.get(
  "/get-buffered-products/:searchQuery",
  authMiddleware,
  getSearchedBufferedProductsController
);

module.exports = router;
