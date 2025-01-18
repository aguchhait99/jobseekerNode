const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const employerController = require("../../module/employer/controller/employerController");
const namedRouter = routerLabel(router);

namedRouter.get(
  "employer-list",
  "/employer",
  employerController.employerListPage
);

module.exports = router;
