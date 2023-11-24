const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const dbConfig = require("./config/mongooseConfig.js");

//
const app = express();
const PORT = process.env.PORT || 3000;

//Cài đặt Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Cài đặt route
const AuthRouter = require("./routers/AuthRouter.js");
const EmployeeRouter = require("./routers/EmployeeRouter.js");
const WorkShiftRouter = require("./routers/WorkShiftRouter.js");

app.use("/api/auth", AuthRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/workshift", WorkShiftRouter);

//Chạy mongoose
dbConfig();
//Kết nối với server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});
