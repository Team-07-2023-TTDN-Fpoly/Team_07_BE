const express = require("express");
const router = express.Router();
const DressController = require("../controllers/DressController");
<<<<<<< HEAD
const {parser,handleImageUpload} = require("../middleware/multer-config.js"); // The configured multer instance
=======
const parser = require("../middleware/multer-config.js"); // The configured multer instance
const AdminMiddleware = require("../middleware/AdminMiddleware.js");
>>>>>>> 8425a01445cc49d5ca6b77ece2718bff43405cc6

// Routes
router.get("/:id", DressController.getDress);
router.get("/", DressController.getAllDresses);
<<<<<<< HEAD
router.post("/", parser.single('dress_image'), DressController.addDress); // 'dress_image' is the name of the field in the form
router.put("/:id", parser.single('dress_image'), DressController.updateDress);
router.delete("/:id", DressController.deleteDress);
=======
router.post("/", parser.single("image"), DressController.addDress); // 'dress_image' is the name of the field in the form
router.put("/:id", parser.single("image"), DressController.updateDress);
router.delete("/:id",AdminMiddleware, DressController.deleteDress);
>>>>>>> 8425a01445cc49d5ca6b77ece2718bff43405cc6

module.exports = router;
