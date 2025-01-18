const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => {
  try {
    const salt = 10;
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  } catch (err) {
    console.log(err);
  }
};

const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

module.exports = { hashPassword, comparePassword };
