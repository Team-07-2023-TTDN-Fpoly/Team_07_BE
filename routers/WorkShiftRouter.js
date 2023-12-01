const express = require("express");
const router = express.Router();
const WorkShiftController = require("../controllers/WorkShiftController.js");

//Get one WorkShift
router.get("/:id", WorkShiftController.getWorkShift);
//Get all WorkShift
router.get("/", WorkShiftController.getAllWorkShift);
//create new WorkShift
router.post("/", WorkShiftController.createWorkShift);
//update information WorkShift
router.put("/information/:id", WorkShiftController.updateWorkShift);
//delete WorkShift
router.delete("/:id", WorkShiftController.deleteWorkShift);
module.exports = router;
