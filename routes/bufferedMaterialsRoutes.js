const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createBufferedMaterialsController,
  deleteBufferedMaterialsController,
  getBufferedMaterialsController,
  getSearchedBufferedMaterialsController,
  deleteBufferedMaterialsByNameController,
} = require("../controllers/bufferedMaterialsController");

const router = express.Router();

//routes
//add buffer product || post
router.post(
  "/create-buffered-materials",
  authMiddleware,
  createBufferedMaterialsController
);

//delete buffer product
router.delete(
  "/delete-buffered-materials/:_id",
  authMiddleware,
  deleteBufferedMaterialsController
);

//delete by name
router.delete(
  "/delete-buffered-materials",
  authMiddleware,
  deleteBufferedMaterialsByNameController
);

//get all records
router.get(
  "/get-buffered-materials",
  authMiddleware,
  getBufferedMaterialsController
);

//get searched records
router.get(
  "/get-buffered-materials/:searchQuery",
  authMiddleware,
  getSearchedBufferedMaterialsController
);

module.exports = router;
