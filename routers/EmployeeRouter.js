const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController.js");
const AdminMiddleware = require('../middleware/AdminMiddleware.js')

//Get one Employee
router.get("/:id", EmployeeController.getEmployeeById);
//Get all Employee
router.get("/",AdminMiddleware, EmployeeController.getAllEmployees);
//create new Employee
router.post("/",AdminMiddleware, EmployeeController.createEmployeeAndUser);
//update information Employee
router.put("/information/:id",AdminMiddleware, EmployeeController.updateEmployee);

module.exports = router;
