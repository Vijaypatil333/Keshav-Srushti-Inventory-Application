const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  deleteInventoryController,
  getSearchedInventoryController,
  getStatisticsInventoryController,
  getPredProductController,
  //getAvailableQuantityController,
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
//add inventory || post
router.post("/create-inventory", authMiddleware, createInventoryController);

//delete inventory
router.delete(
  "/delete-inventory/:_id",
  authMiddleware,
  deleteInventoryController
);

//get all records
router.get("/get-inventory", authMiddleware, getInventoryController);

//get pred records
router.get(
  "/get-pred-inventory/:currentSeason",
  authMiddleware,
  getPredProductController
);

//get searched all records
router.get(
  "/get-inventory/:searchQuery",
  authMiddleware,
  getSearchedInventoryController
);

//statistics
router.get("/statistics", authMiddleware, getStatisticsInventoryController);

module.exports = router;
