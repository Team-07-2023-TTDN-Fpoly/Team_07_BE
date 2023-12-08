const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController.js");
const AdminMiddleware = require('../middleware/AdminMiddleware.js')

// Get one Customer
router.get("/:id", CustomerController.getCustomerById);
// Get all Customers
router.get("/", CustomerController.getAllCustomers);
// Create a new Customer
router.post("/", CustomerController.createCustomer);
// Update Customer information
router.put("/information/:id", CustomerController.updateCustomer);
// Delete
router.delete("/:id",AdminMiddleware, CustomerController.deleteCustomer);
module.exports = router;
