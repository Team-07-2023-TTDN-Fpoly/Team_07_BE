const express = require("express");
const router = express.Router();
const DressTypeController = require("../controllers/DressTypeController.js");

//Get one DressType
router.get("/:id", DressTypeController.getDressType);
//Get all DressType
router.get("/", DressTypeController.getAllDressType);
//create new DressType
router.post("/", DressTypeController.createDressType);
//update information DressType
router.put("/:id", DressTypeController.updateDressType);
//Delete DressType
router.delete("/:id", DressTypeController.deleteDressType);

module.exports = router;
