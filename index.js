const { join, resolve } = require("path");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const connectDB = require("./app/config/db");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();

const app = express();
connectDB();
const namedRouter = require("route-label")(app);

// ****************** Import Configuration ********************
const appConfig = require(resolve(join(__dirname, "app/config", "index")));

// ***************** Import Utils ***********************
const utils = require(resolve(join(__dirname, "app/helper", "utils")));

// ****************** Application Configuration *********************
const getPort = appConfig.appRoot.port;
const getHost = appConfig.appRoot.host;
const isProduction = appConfig.appRoot.isProd;
const getApiFolderName = appConfig.appRoot.getApiFolderName;
const getAdminFolderName = appConfig.appRoot.getAdminFolderName;

// ******************** Global Function to Generate URLs for named routes ***********************
global.generateUrl = generateurl = (routeName, routeParams = {}) => {
  const url = namedRouter.urlFor(routeName, routeParams);
  return url;
};

// ******************* Other Configuration *********************
app.use(cors());
app.use(express.static(resolve(join(__dirname, "public"))));
app.use(express.static("/public"));
app.use(express.static("uploads"));
app.use("/uploads", express.static(__dirname + "uploads"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cookieParser());
app.use(flash());

// ************************ Error Handling for Server ************************
const onError = (error) => {
  const port = getPort;
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe" + port : "Port" + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(0);
      break;
    default:
      throw error;
  }
};

(async () => {
  try {
    // ************** api route ****************
    const apiFiles = await utils._readdir(`./app/router/${getApiFolderName}`);
    apiFiles.forEach((file) => {
      if (!file || file[0] == ".") return;
      namedRouter.use("/api", require(join(__dirname, file)));
    });
    // ************** admin route ****************
    const adminFiles = await utils._readdir(
      `./app/router/${getAdminFolderName}`
    );
    adminFiles.forEach((file) => {
      if (!file || file[0] == ".") return;
      namedRouter.use("/", require(join(__dirname, file)));
    });

    // Building Route Table for Debugging
    namedRouter.buildRouteTable();

    if (!isProduction && process.env.SHOW_NAMED_ROUTES === "true") {
      const apiRouteList = namedRouter.getRouteTable("/api");
      const userRouteList = namedRouter.getRouteTable("/");

      console.log("Route Tables:");
      console.log("API Routes:", apiRouteList);
      console.log("User Routes:", userRouteList);
    }

    // ************ Server Setup ***********
    app.listen(getPort);

    app.on("error", onError);

    console.log(`Project is running on http://${getHost}:${getPort}`);
  } catch (err) {
    console.log(err);
  }
})();
