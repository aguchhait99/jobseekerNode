const express = require("express");
const router = express.Router();
const routerLabel = require("route-label");
const namedRouter = routerLabel(router);
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const { comparePassword } = require("../../../helper/commonHelper");
const SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

class AuthController {
  // Login Page
  async loginPage(req, res) {
    try {
      res.render("auth/signin");
    } catch (err) {
      console.log(err);
    }
  }
  // Login Admin
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.redirect(namedRouter.urlFor("login-page"));
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.redirect(namedRouter.urlFor("login-page"));
      }
      const isPasswordMatch = await comparePassword(password, user.password);
      if (!isPasswordMatch) {
        return res.redirect(namedRouter.urlFor("login-page"));
      }
      if (user && user.role !== "admin") {
        return res.redirect(namedRouter.urlFor("login-page"));
      }
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      // Set token in cookies
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      return res.redirect(namedRouter.urlFor("employer-list"));
    } catch (err) {
      console.log(err);
    }
  }

  // Logout
  async logout(req, res) {
    res.clearCookie("adminToken");
    res.redirect(namedRouter.urlFor("login-page"));
  }
}

module.exports = new AuthController();
