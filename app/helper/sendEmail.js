const { transporter } = require("../config/emailConfig")


const sendMailRegistration = async (user, password) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Login Credentials",
        html: `<p>Hello ${user.name},</p><p>Your password is ${password}.</p> <p>You can login using given password or you can change the password with below link before login.</p>`,
      })
      return password;
}   

module.exports = sendMailRegistration;