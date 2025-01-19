const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const { UserModel, UserValidationSchema } = require("../../auth/model/user");
const { generateRandomPassword, hashPassword } = require("../../../helper/commonHelper");
const UserRepositories = require("../../auth/repositories/UserRepositories");
const namedRouter = routerLabel(router);
const sendMailRegistration = require('../../../helper/sendEmail')

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
  // Add Employer Page
  async employeeADDPage(req, res){
    try{
      return res.render('employer/add')
    }catch(err){
      console.log(err)
    }
  }
  // Employer Add 
  async employerAdd(req, res){
    try{
      const {name, email} = req.body;
      console.log("user====>", req.body)
      if(!email || !name){
        return res.redirect(namedRouter.urlFor("employer-add"))
      }
      const existingUser = await UserModel.findOne({email})
      console.log('existingUser', existingUser)
      if(existingUser){
        return res.redirect(namedRouter.urlFor("employer-add"))
      }
      const password = generateRandomPassword()

      const hashedPassword = await hashPassword(password)

      // Prepare user data
      const data = {
        name: name,
        email: email,
        password: hashedPassword, 
        image: req?.file ? req?.file?.path : null,
        role: "employer"
      }

      // User Schema 
      const {error, value} = UserValidationSchema.validate(data)
      if(error){
        console.log(error)
        return res.redirect(namedRouter.urlFor("employer-add"))
      }else{
        const user = await UserRepositories.UserRegistration(value)
        if(!user){
          return res.redirect(namedRouter.urlFor("employer-add"))
        }
        await sendMailRegistration(user, password)
        return res.redirect(namedRouter.urlFor("employer-list"))
      }
    }catch(err){
      console.log(err)
    }
  }
}

module.exports = new EmployerController();
