const express = require("express");
const router = express.Router();
const WorkShiftController = require("../controllers/WorkShiftController.js");
const AdminMiddleware = require('../middleware/AdminMiddleware.js')
//Get one WorkShift
router.get("/:id", WorkShiftController.getWorkShift);
//Get all WorkShift
router.get("/", WorkShiftController.getAllWorkShift);
//create new WorkShift
router.post("/",AdminMiddleware, WorkShiftController.createWorkShift);
//update information WorkShift
router.put("/information/:id",AdminMiddleware, WorkShiftController.updateWorkShift);
//delete WorkShift
router.delete("/:id",AdminMiddleware, WorkShiftController.deleteWorkShift);
module.exports = router;
