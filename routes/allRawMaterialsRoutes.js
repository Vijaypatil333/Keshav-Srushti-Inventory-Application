const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createAllRawMaterialsController,
  deleteAllRawMaterialsController,
  getAllRawMaterialsController,
  getSearchedAllRawMaterialsController,
  getBufferedRawMaterialsController,
} = require("../controllers/allRawMaterialsController");

const router = express.Router();

//routes
//add raw material || post
router.post(
  "/create-all-raw-materials",
  authMiddleware,
  createAllRawMaterialsController
);

//delete raw material
router.delete(
  "/delete-all-raw-materials/:_id",
  authMiddleware,
  deleteAllRawMaterialsController
);

//get all records
router.get(
  "/get-all-raw-materials",
  authMiddleware,
  getAllRawMaterialsController
);

//get searched all records
router.get(
  "/get-all-raw-materials/:searchQuery",
  authMiddleware,
  getSearchedAllRawMaterialsController
);

//get buffered records
router.get(
  "/get-buffered-raw-materials",
  authMiddleware,
  getBufferedRawMaterialsController
);

module.exports = router;
