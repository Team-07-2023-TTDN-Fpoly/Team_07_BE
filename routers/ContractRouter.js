const express = require("express");
const router = express.Router();
const ContractController = require("../controllers/ContractController.js");

// Routes
//get one contract
// router.get("/:id", ContractController.getContact);
//get all contract
router.get("/", ContractController.getAllContracts);
//Thêm mới một contract
router.post("/", ContractController.createContract);
//thay đổi thông tin một contract
// router.put("/:id", ContractController.updateContract);
//xóa một contract
// router.delete("/:id", ContractController.deleteContract);

module.exports = router;
