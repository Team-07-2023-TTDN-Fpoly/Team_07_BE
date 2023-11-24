const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController.js");

// Get one Customer
router.get("/:id", CustomerController.getCustomerById);
// Get all Customers
router.get("/", CustomerController.getAllCustomers);
// Create a new Customer
router.post("/", CustomerController.createCustomer);
// Update Customer information
router.put("/information/:id", CustomerController.updateCustomer);

module.exports = router;





