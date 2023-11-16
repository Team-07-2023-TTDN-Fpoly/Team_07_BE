const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const dbConfig = require("./config/mongooseConfig.js");

//
const app = express();
const PORT = process.env.PORT || 8081;

//Cài đặt Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Chạy mongoose
dbConfig();
//Cài đặt route
const EmployeeRouter = require("./routers/EmployeeRouter.js");

app.use("api/employee", EmployeeRouter);

//Kết nối với server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});
