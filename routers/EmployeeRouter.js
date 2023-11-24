const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController.js");

//Get one Employee
router.get("/get/:id", EmployeeController.getEmployeeById);
//Get all Employee
router.get("/", EmployeeController.getAllEmployees);
//create new Employee
router.post("/", EmployeeController.createEmployeeAndUser);
//update information Employee
router.put("/information/:id", EmployeeController.updateEmployee);

module.exports = router;
