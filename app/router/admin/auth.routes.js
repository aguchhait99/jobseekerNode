const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const authController = require("../../module/auth/controller/authController");
const namedRouter = routerLabel(router);

namedRouter.get("login-page", "/signin", authController.loginPage);
namedRouter.get("logout", "/logout", authController.logout);
namedRouter.post("signin", "/signin-admin", authController.adminLogin);

module.exports = router;
