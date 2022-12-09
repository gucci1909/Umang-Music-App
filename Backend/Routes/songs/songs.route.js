require("dotenv").config();
const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");
const Songs = require("./songs.modules");
const checkToken = require("../../middleware/checkToken");
const cloudinary = require("cloudinary").v2;
const checkAdmin = require("../../middleware/checkAdmin");

app.use(checkToken);
cloudinary.config({
  cloud_name: "dtdqzefvj",
  api_key: process.env.KEY_CLOUDINARY,
  api_secret: process.env.SECRET_CLOUDINARY,
});

//GETTING ALL SONGS (LIMIT=6)
app.get("/", async (req, res) => {
  try {
    const { limit = 6, page = 1 } = req.query;
    const result = await Songs.find()
      .limit(6)
      .skip((page - 1) * limit);
    res.status(200).json({
      Songs: result,
    });
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

//GETTING ID BY PARAMS
app.get("/:id", async (req, res) => {
  try {
    // const bay = await Songs.getIndexes();
    // console.log(bay)
    // Songs.aggregate([
      // {
        // $group: {
          // $_id:req.params.id,
          // $title:{
            // $_id:req.params.id
          // }

        // },
      // },
    // ]).exec((err,location)=>{
      // if (err) throw err;
    // res.send(location);
    // })
    // console.log("iuyg");
    // res.send("oihgv");
    const result = await Songs.findById(req.params.id);
    if (result) {
    res.status(200).json({
    Song: result,
    });
    } else {
    res.status(404).json({
    message: "Song not found",
    });
    }
  } catch (error) {
    res.status(404).json({
      error: "Song not found",
    });
  }
});

// POSTING SONGS ON DATABASE
app.post("/", checkAdmin, async (req, res) => {
  const room_users = await Songs.find({
    roomNo: req.body.roomNo,
  });
  if (room_users.length >= 1) {
    res.status(404).json({
      message: "Room No. already exists",
    });
  } else {
    const file = req.files.songs;
    cloudinary.uploader.upload(
      file.tempFilePath,
      {
        resource_type: "video",
        folder: "video",
      },
      async (err, result) => {
        if (err) {
          res.status(404).json({
            error: "Error in uploading",
          });
        } else {
          try {
            const song = new Songs({
              _id: new mongoose.Types.ObjectId(),
              title: req.body.title,
              imageURL: req.body.imageURL,
              artistNames: req.body.artistNames,
              releaseYearOfSong: req.body.releaseYearOfSong,
              roomNo: req.body.roomNo,
              songURL: result.url,
            });
            const response = await song.save();
            res.status(200).json({
              Songs: response,
            });
          } catch (error) {
            res.status(404).json({
              error: error,
            });
          }
        }
      }
    );
  }
});

//DELETING ANY SONG BY ID
app.delete("/:id", checkAdmin, async (req, res) => {
  try {
    const response = await Songs.deleteOne({ _id: req.params.id });
    if (response)
      res.status(200).json({
        Songs: response,
      });
    else {
      res.status(404).json({
        error: "ID NOT FOUND",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "ID NOT FOUND",
    });
  }
});

module.exports = app;
