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
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: "dtdqzefvj",
  api_key: process.env.KEY_CLOUDINARY,
  api_secret: process.env.SECRET_CLOUDINARY,
});

app.get("/", (req, res) => {
  Songs.find()
    .exec()
    .then((result) => {
      res.status(200).json({
        Songs: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
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

app.post("/", checkAdmin, (req, res) => {
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
          releaseYearOfSong: req.body.releaseYearOfSong,
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
              error: "You are doing something wrong",
            });
          });
      }
    }
  );
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
