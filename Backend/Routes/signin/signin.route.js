const express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../signup/signup.modules");
const argon2 = require("argon2");

app.post("/", async (req, res) => {
  const users = await Users.find({ username: req.body.username });

  if (users.length >= 1) {
    if (await argon2.verify(users[0].password, req.body.password)) {
      const token = jwt.sign(
        {
          // _id: users[0]._id,
          username: users[0].username,
          userType: users[0].userType,
        },
        "qwertyuiop",
        {
          expiresIn: "1d",
        }
      );
      const refreshToken = jwt.sign(
        {
          _id: users[0]._id,
          username: users[0].username,
          userType: users[0].userType,
        },
        "qwertyrefresh",
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        AccessToken: token,
        RefreshToken: refreshToken,
        username: users[0].username,
        userType: users[0].userType,
        id: users[0]._id,
      });
    } else {
      res.status(401).json({
        message: "Your Password is Wrong",
      });
    }
  } else {
    res.status(404).json({
      message: "USER NOT FOUND",
    });
  }
});

app.post("/verify", (req, res) => {
  const refreshToken = req.headers["refresh_token"];
  const accessToken = req.headers["access_token"];

  if (!refreshToken) {
    res.status(404).send("Unauthorized");
  } else {
    try {
      const access_verification = jwt.verify(accessToken, "qwertyuiop");

      if (access_verification) {
        res.status(200).send("You are authorized");
      } else {
        const refresh_verification = jwt.verify(refreshToken, "qwertyrefresh");

        if (refresh_verification) {
          const newToken = jwt.sign(
            {
              // _id: verification._id,
              username: refresh_verification.username,
              userType: refresh_verification.userType,
            },
            "qwertyuiop",
            {
              expiresIn: "1d",
            }
          );

          res.status(200).json({
            AccessToken: newToken,
          });
        } else {
          res.status(404).send("Unauthorized");
        }
      }
    } catch (error) {
      try {
        const refresh_verification = jwt.verify(refreshToken, "qwertyrefresh");

        if (refresh_verification) {
          const newToken = jwt.sign(
            {
              // _id: refresh_verification._id,
              username: refresh_verification.username,
              userType: refresh_verification.userType,
            },
            "qwertyuiop",
            {
              expiresIn: "1d",
            }
          );

          res.status(200).json({
            AccessToken: newToken,
          });
        } else {
          res.status(404).json({
            error: error,
          });
        }
      } catch (error) {
        res.status(404).json({
          error: error,
        });
      }
    }
  }
});

module.exports = app;
