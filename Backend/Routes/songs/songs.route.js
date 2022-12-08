require("dotenv").config();
const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");
const Songs = require("./songs.modules");
const checkToken = require("../../middleware/checkToken");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const checkAdmin = require("../../middleware/checkAdmin");

app.use(checkToken);
cloudinary.config({
  cloud_name: "dtdqzefvj",
  api_key: process.env.KEY_CLOUDINARY,
  api_secret: process.env.SECRET_CLOUDINARY,
});

app.get("/", async(req, res) => {
  try {
    const {limit=6,page=1} = req.query;
    const result = await Songs.find().limit(6).skip((page-1)*limit);
    res.status(200).json({
      Songs: result,
    });
  } catch (error) {
    res.status(404).json({
      error: error
    });
  }
});

app.get("/:id", (req, res) => {
  Songs.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          Song: result,
        });
      } else {
        res.status(404).json({
          message: "Song not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Song not found",
      });
    });
});

app.post("/",checkAdmin,async (req, res) => {
  // console.log(re);
  const room_users = await Songs.find({
    roomNo: req.body.roomNo
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
      (err, result) => {
        if (err) {
          res.status(404).json({
            error: "Error in uploading",
          });
        } else {
          const song = new Songs({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            imageURL: req.body.imageURL,
            artistNames:req.body.artistNames,
            releaseYearOfSong: req.body.releaseYearOfSong,
            roomNo : req.body.roomNo,
            songURL: result.url,
          });
          song.save();
  
          Songs.find()
            .then((response) => {
              if (result)
                res.status(200).json({
                  Songs: response,
                });
              else {
                res.status(404).json({
                  error: "You are doing something wrong",
                });
              }
            })
            .catch((err) => {
              res.status(404).json({
                error: err,
              });
            });
        }
      }
    );
  }
});

app.delete("/:id", checkAdmin, (req, res) => {
  Songs.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        Songs.find()
          .then((response) => {
            if (result)
              res.status(200).json({
                Songs: response,
              });
            else {
              res.status(404).json({
                error: "You are doing something wrong",
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              error: "You are doing something wrong",
            });
          });
      } else {
        res.status(404).json({
          message: "Song not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: "You are doing something wrong",
      });
    });
});

module.exports = app;
