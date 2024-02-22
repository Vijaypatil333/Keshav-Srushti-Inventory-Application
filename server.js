// to connect nodejs to reactjs - cors
// to connect mongodb - mongoose
// to provide security feature - dotenv
// to print urls to console - morgan
// for css - bootstrap
// for routing - react router dom
// state management tool - redux toolkit

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/mongo_db");
const path = require("path");

//dot config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewears
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
//1 test
app.use("/api/v1/test", require("./routes/testRoute"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/raw-material", require("./routes/rawMaterialRoutes"));
app.use("/api/v1/all-products", require("./routes/allProductsRoutes"));
app.use("/api/v1/all-raw-materials", require("./routes/allRawMaterialsRoutes"));
app.use(
  "/api/v1/buffered-products",
  require("./routes/bufferedProductsRoutes")
);
app.use(
  "/api/v1/buffered-materials",
  require("./routes/bufferedMaterialsRoutes")
);

//static folder
app.use(express.static(path.join(__dirname, "./client/build")));

//static route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const PORT = process.env.PORT || 333;

//listen
app.listen(PORT, () => {
  console.log(
    `Node server running In ${process.env.DEV_MODE} Mode On Port ${process.env.PORT} `
      .bgBlue.white
  );
});
