const express = require("express");
const router = express.Router();
const DressController = require("../controllers/DressController");
const parser = require("../middleware/multer-config.js"); // The configured multer instance
const AdminMiddleware = require("../middleware/AdminMiddleware.js");

// Routes
router.get("/:id", DressController.getDress);
router.get("/", DressController.getAllDresses);
router.post("/", parser.single("image"), DressController.addDress); // 'dress_image' is the name of the field in the form
router.put("/:id", parser.single("image"), DressController.updateDress);
router.delete("/:id",AdminMiddleware, DressController.deleteDress);

module.exports = router;
