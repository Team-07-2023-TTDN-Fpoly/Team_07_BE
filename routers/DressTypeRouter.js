const express = require("express");
const router = express.Router();
const DressTypeController = require("../controllers/DressTypeController.js");
const AdminMiddleware = require('../middleware/AdminMiddleware.js')

//Get one DressType
router.get("/:id", DressTypeController.getDressType);
//Get all DressType
router.get("/", DressTypeController.getAllDressType);
//create new DressType
router.post("/",AdminMiddleware, DressTypeController.createDressType);
//update information DressType
router.put("/information/:id",AdminMiddleware, DressTypeController.updateDressType);
//Delete DressType
router.delete("/:id",AdminMiddleware, DressTypeController.deleteDressType);

module.exports = router;
