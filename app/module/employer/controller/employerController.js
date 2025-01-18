const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const { UserModel } = require("../../auth/model/user");
const namedRouter = routerLabel(router);

class EmployerController {
  // Employer List page
  async employerListPage(req, res) {
    try {
      const employers = await UserModel.find({ role: "employer" });
      res.render("employer/list", {
        data: employers,
      });
    } catch (err) {
      console.log(err);
    }
  }
  // Add Employee 
  async employeeADDPage(req, res){
    try{
      return res.render('employer/add')
    }catch(err){
      console.log(err)
    }
  }
}

module.exports = new EmployerController();
