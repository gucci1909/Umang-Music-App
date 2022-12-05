const express = require("express");
const app = express.Router();
const { passport } = require("../signup/signup.route");

app.use(express.urlencoded({ extended: true }));

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { successRedirect: "http://localhost:3000" })
);

app.get("/success", (req, res) => {
  if (req.sessionStore.sessions) {
    const data = Object.values(req.sessionStore.sessions);
    res.send(data);
  }
});

app.get("/logout", function (req, res, next) {
  req.sessionStore.clear();
  res.clearCookie("SESS_NAME");
  res.send("hello");
});

module.exports = app;
