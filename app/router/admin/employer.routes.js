const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const employerController = require("../../module/employer/controller/employerController");
const ImageUpload = require("../../helper/imageUpload");
const namedRouter = routerLabel(router);

namedRouter.get(
  "employer-list",
  "/employer",
  employerController.employerListPage
);
namedRouter.get("employer-add", "/employer-add", employerController.employeeADDPage);
namedRouter.post("employer-register", "/employer-registration", ImageUpload.single("image"), employerController.employerAdd)


module.exports = router;
