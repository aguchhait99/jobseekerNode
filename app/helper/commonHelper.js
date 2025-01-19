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

function generateRandomPassword(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
  let password = '';
  
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
  }
  
  return password;
}

module.exports = { hashPassword, comparePassword, generateRandomPassword };
