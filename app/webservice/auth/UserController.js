const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const { hashPassword, comparePassword } = require("../../helper/commonHelper");
const {
  UserModel,
  UserValidationSchema,
} = require("../../module/auth/model/user");
const UserRepositories = require("../../module/auth/repositories/UserRepositories");

class UserController {
  // User Registration
  async userRegistration(req, res) {
    try {
      const { name, email, password } = req.body;
      // Check for missing fields
      if (!email || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }
      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email is already exists.",
        });
      }
      // Hash Password
      const hashedPassword = await hashPassword(password);

      // Prepare user data
      const data = {
        name: name,
        email: email,
        role: "jobSeeker",
        password: hashedPassword,
        image: req?.file ? req?.file?.path : null,
      };
      const { error, value } = UserValidationSchema.validate(data);
      if (error) {
        return res.status(401).json({
          status: false,
          message: error.details[0].message,
        });
      } else {
        // save user
        const user = await UserRepositories.UserRegistration(value);
        if (!user) {
          return res.status(500).json({
            status: false,
            message: "Failed to register user. Please try again.",
          });
        }
        // Successfull response
        return res.status(201).json({
          status: true,
          message: "User registered successfully.",
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });
      }
    } catch (err) {
      console.log("Error in user registration: ", err.message);
      return res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
        error: err.message,
      });
    }
  }
  // User Login
  async loginUser (req, res){
    try{
      const {email, password} = req.body;
      if(!email || !password){
        return res.status(400).json({
          status: false, 
          message: "All fields are required."
        })
      }
      const user = await UserModel.findOne({email})
      if(!user){
        return res.status(400).json({
          status: false, 
          message: "User not found!"
        })
      }
      const isPasswordMatched = await comparePassword(password, user.password)
      if(!isPasswordMatched){
        return res.status(400).json({
          status: false, 
          message: "Invalid Credentials"
        })
      }
      const token = jwt.sign(
        {
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          image: user.image
        },
        SECRET_KEY,
        {
          expiresIn: '1h'
        }
      )
      return res.status(200).json({
        status: true, 
        message: "User logged in successfully.",
        user: {
          name: user.name, 
          email: user.email, 
          role: user.role,
          image: user.image
        }, 
        token: token
      })
    }catch(err){
      console.log("Error in user login: ", err)
      res.status(500).json({
        status: false, 
        message: "Internal server error! Please try again later!",
        error: err.message
      })
    }
  }
}

module.exports = new UserController();
