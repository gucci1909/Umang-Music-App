require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Users = require("./signup.modules");
const argon2 = require("argon2");

route.get("/", (req, res) => {
  Users.find()
    .exec()
    .then((result) => {
      res.status(200).json({
        Info_Of_All_Users: result,
      });
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
});

route.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await Users.findById(id);
    if (user) {
      res.status(200).json({
        oneUser: user,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

route.post("/", async (req, res) => {
  const email_users = await Users.find({
    emailID: req.body.emailID,
  });
  if (email_users.length >= 1) {
    res.status(404).json({
      message: "EmailID already exists",
    });
  } else {
    if (req.body.userType === "admin") {
      res.status(403).json({
        message: "You are not allowed to create admin account",
      });
    } else {
      try {
        const hash = await argon2.hash(req.body.password);
        const new_user = new Users({
          _id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          password: hash,
          phone: req.body.phone,
          emailID: req.body.emailID,
          userType: req.body.userType,
        });
        const created_users = await new_user.save();

        res.status(201).json({
          newUser: created_users,
        });
      } catch (error) {
        res.status(404).json({
          error: error,
        });
      }
    }
  }
});

route.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedInfo = await Users.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

route.delete("/:id", (req, res) => {
  Users.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "User Deleted",
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
});

// passport js

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const users = await Users.find({ emailID: profile._json.email });
      // console.log(users.length);
      if (users.length >= 1) {
        const token = jwt.sign(
          {
            username: users[0].username,
            userType: "user",
          },
          "qwertyuiop",
          {
            expiresIn: "1d",
          }
        );
        const data = {
          create: users,
          AccessToken: token,
        };
        return cb(null, data);
      } else {
        const user = new Users({
          _id: new mongoose.Types.ObjectId(),
          username: profile._json.given_name,
          password: uuidv4(),
          phone: 000000000,
          emailID: profile._json.email,
          userType: "user",
        });
        const token = jwt.sign(
          {
            username: profile._json.given_name,
            userType: "user",
          },
          "qwertyuiop",
          {
            expiresIn: "1d",
          }
        );
        const users = await user.save();
        const data = {
          create: users,
          AccessToken: token,
        };
        return cb(null, data);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  return cb(null, user);
});

passport.deserializeUser((id, cb) => {
  return cb(null, id);
});

module.exports = { route, passport };
