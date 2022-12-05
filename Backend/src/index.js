require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connect = require("../config/db");
const { route } = require("../Routes/signup/signup.route");
const SigninRoute = require("../Routes/signin/signin.route");
const SongRoute = require("../Routes/songs/songs.route");
const cookieParser = require("cookie-parser");
const FavSongRoute = require("../Routes/favSong/favSong.route");
const googleRoute = require("../Routes/googlepassport/google");
const passport = require("passport");
const session = require("express-session");
const otpRoute = require("../Routes/reset_password/reset.route");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    name: "SESS_NAME",
    secret: "123456789",
    session: false,
    resave: false,
    cookie: {
      maxAge: 360000,
      secure: false,
    },
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", googleRoute);
app.use("/signup", route);
app.use("/otp", otpRoute);
app.use("/signin", SigninRoute);
app.use("/songs", SongRoute);
app.use("/favSongs", FavSongRoute);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello world");
});

//github signIn

app.get("/auth", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  const { access_token } = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  )
    .then((e) => e.json())
    .catch(console.error);
  console.log(access_token);

  try {
    const userDetails = await fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((e) => e.json());
    console.log(userDetails);
  } catch (error) {
    console.log(error);
  }

  return res.send("signIn with github success");
});

//port listen

app.listen(PORT, async () => {
  await connect();
  console.log(`http://localhost:${PORT}/`);
});
