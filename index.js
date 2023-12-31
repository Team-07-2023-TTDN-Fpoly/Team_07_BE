const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");

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

app.use(
  session({
    secret: "dress_hub",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 * 24 },
  })
);
//Cài đặt route
const AuthRouter = require("./routers/AuthRouter.js");
const EmployeeRouter = require("./routers/EmployeeRouter.js");
const WorkShiftRouter = require("./routers/WorkShiftRouter.js");
const CustomerRouter = require("./routers/CustomerRouter.js");
const DressRouter = require("./routers/DressRouter.js");
const DressTypeRouter = require("./routers/DressTypeRouter.js");
const ContractRouter = require("./routers/ContractRouter.js");
const DetailStatisticsRouter = require("./routers/DetailStatisticsRouter");
const AuthMiddleware = require("./middleware/AuthMiddleware.js");
const AdminMiddleware = require("./middleware/AdminMiddleware.js");

//
app.use("/api/auth", AuthRouter);
app.use(AuthMiddleware);
app.use("/api/employee", EmployeeRouter);
app.use("/api/workshift", WorkShiftRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/detailstatistics", DetailStatisticsRouter);
app.use("/api/dresses", DressRouter);
app.use("/api/dresstype", DressTypeRouter);
app.use("/api/contract", ContractRouter);

//Chạy mongoose
dbConfig();

//Kết nối với server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});
