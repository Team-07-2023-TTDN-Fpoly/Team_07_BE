const express = require("express");
const router = express.Router();
const WorkShiftController = require("../controllers/WorkShiftController.js");

//Get one WorkShift
// router.get("/:id", WorkShiftController.get);
//Get all WorkShift
router.get("/", WorkShiftController.getAllWorkShift);
//create new WorkShift
router.post("/", WorkShiftController.createWorkShift);
//update information WorkShift
router.put("/:id", WorkShiftController.updateWorkShift);

module.exports = router;
