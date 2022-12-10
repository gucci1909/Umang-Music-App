require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connect = require("../config/db");
const { route } = require("../Routes/signup/signup.route");
const http = require("http");
const { Server } = require("socket.io");
const SigninRoute = require("../Routes/signin/signin.route");
const SongRoute = require("../Routes/songs/songs.route");
const cookieParser = require("cookie-parser");
const FavSongRoute = require("../Routes/favSong/favSong.route");
const googleRoute = require("../Routes/googlepassport/google");
const passport = require("passport");
const session = require("express-session");
const otpRoute = require("../Routes/reset_password/reset.route");
const Chat = require("./chatModules");
const Redis = require("ioredis");

const redis = new Redis({
  port: 14092 , // Redis port
  host: "redis-14092.c212.ap-south-1-1.ec2.cloud.redislabs.com", // Redis host
  username: "default", // needs Redis >= 6
  password: "GlyEsyeKKXMLMwnUthiTmLjboR28tjJq",
  db: 0, // Defaults to 0
});



app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(
  session({
    name: "SESS_NAME",
    secret: "123456789",
    session: false,
    resave: false,
    cookie: {
      maxAge: 30*24*60*60*1000,
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


app.get("/", (req, res) => {
  res.send("hello world");
});

// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint doesnt exist'
//   })
// });

// socket.io

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/comments/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    const Chats = await Chat.find({chat_id:id});
    res.status(200).json({
      Comments: Chats
    });
  } catch (error) {
    res.status(200).send("THIS ROOM ID NOT FOUND");
  }

})

io.on("connection", (socket) => {

  socket.on("join_room",(data)=>{

    socket.join(data);
  })

  socket.on("send_message",async (data) => {

    const messages = new Chat({
      chat_id : data.room1,
      message: data.state
    })
    const response = await messages.save();
    // console.log(response);
    io.in(data.room1).emit("receive_message",data);
  });

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
  // console.log(access_token);

  try {
    const userDetails = await fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((e) => e.json());
    // console.log(userDetails);
  } catch (error) {
    console.log(error);
  }

  return res.send("signIn with github success");
});

//port listen

server.listen(PORT, async () => {
  await connect();
  console.log(`http://localhost:${PORT}`);
});
