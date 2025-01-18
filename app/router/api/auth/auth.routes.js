const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const UserController = require("../../../webservice/auth/UserController");
const ImageUpload = require("../../../helper/imageUpload");
const namedRouter = routerLabel(router);

namedRouter.post(
  "user-registration",
  "/user-registration",
  ImageUpload.single("image"),
  UserController.userRegistration
);
namedRouter.post("user-login", "/user-login", UserController.loginUser)

module.exports = router;
