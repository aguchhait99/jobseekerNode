const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const UserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  role: Joi.string().required(),
  password: Joi.string().required(),
  image: Joi.string()
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["admin", "employer", "jobSeeker"],
      default: "jobSeeker",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel, UserValidationSchema };
