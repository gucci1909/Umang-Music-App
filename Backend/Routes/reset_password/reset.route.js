require("dotenv").config();
const express = require("express");
const app = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Users = require("../signup/signup.modules");
const Passwords = require("./reset.modules");
const argon2 = require("argon2");
const fs = require("fs");
const hbs = require("handlebars");

const template = hbs.compile(fs.readFileSync(__dirname + "/mail.hbs", "utf-8"));

var transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  service: "gmail",
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.EMAIL_SMTP,
    pass: process.env.PASSWORD_SMTP,
  },
  secure: false,
});

app.get("/", async (req, res) => {
  try {
    const data = await Passwords.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/create", async (req, res) => {
  const { emailID } = req.body;
  const user = await Users.find({ emailID: emailID });
  if (user.length >= 1) {
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const mailData = {
      from: "umangarora0134@gmail.com",
      to: user[0].emailID,
      subject: "OTP",
      text: "OTP",
      html: template({ otp: otp }),
    };

    const passwords = new Passwords({
      emailID: emailID,
      otp: otp,
    });
    const saving_data = await passwords.save();
    setTimeout(async () => {
      const reset_users = await Passwords.find({ emailID: emailID });
      const delete_reset_users = await Passwords.deleteOne({
        _id: reset_users[0]._id,
      });
      if (delete_reset_users) {
        console.log("otp deleted successfully");
      } else {
        console.log("no otp detected");
      }
    }, 60000);
    otp = "";
    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        res.status(404).send(error);
      } else {
        res.status(200).json({
          message: "Message Send",
          message_id: info,
          data: saving_data,
        });
      }
    });
  } else {
    res.status(404).send("This email ID doesn't exist");
  }
});

app.put("/check", async (req, res) => {
  const { otp, emailID, new_password } = req.body;

  const reset_users = await Passwords.find({ emailID: emailID });
  if (reset_users) {
    try {
      if (otp === reset_users[0].otp) {
        const hash = await argon2.hash(new_password);
        try {
          const users = await Users.find({ emailID: emailID });
          const update_password = await Users.findByIdAndUpdate(
            users[0]._id,
            { ...req.body, password: hash },
            { new: true }
          );
          console.log(update_password);
          if (update_password) {
            res.status(201).send("Your password has been changed successfully");
          }
        } catch (error) {
          res.status(403).send(error);
        }
      } else {
        res.status(403).send("This otp is expired");
      }
    } catch (e) {
      res.status(404).json({
        error: "THIS OTP DOESN'T EXIST",
      });
    }
  } else {
    res.status(404).send("This emailID does not exist");
  }
});

module.exports = app;
