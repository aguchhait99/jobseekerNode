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
namedRouter.get("employer-add", "/employer-add", employerController.employeeADDPage)

module.exports = router;
