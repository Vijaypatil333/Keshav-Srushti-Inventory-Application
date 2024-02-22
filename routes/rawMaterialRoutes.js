const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createRawMaterialController,
  getRawMaterialController,
  getSearchedRawMaterialController,
  deleteRawMaterialController,
} = require("../controllers/rawMaterialController");

const router = express.Router();

//routes
//add raw material || post
router.post(
  "/create-raw-material",
  authMiddleware,
  createRawMaterialController
);

//delete raw material
router.delete(
  "/delete-raw-material/:_id",
  authMiddleware,
  deleteRawMaterialController
);

//get all records
router.get("/get-raw-material", authMiddleware, getRawMaterialController);

//get searched all records
router.get(
  "/get-raw-material/:searchQuery",
  authMiddleware,
  getSearchedRawMaterialController
);

module.exports = router;
