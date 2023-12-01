const express = require('express');
const router = express.Router();
const DetailStatisticsController = require("../controllers/DetailStatisticsController");

// Get all Detail
router.get("/", DetailStatisticsController.getAllDetail);
// Create a new 
router.post("/", DetailStatisticsController.CreateDetail);
// Update information
router.put("/information/:id", DetailStatisticsController.UpdateDetail);
module.exports = router;