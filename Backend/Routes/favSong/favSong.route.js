const express = require("express");
const app = express.Router();
const FavSongs = require("./favSong.modules");
const checkToken = require("../../middleware/checkToken");

app.use(checkToken);

app.get("/", async (req, res) => {
  try {
    const favSong = await FavSongs.find();
    if (!favSong) {
      res.status(404).json({
        message: "No favourite Song found",
      });
    } else {
      res.status(200).json({
        favSong,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const favSongs = await FavSongs.find({ userID: req.params.id }).populate(["songID"]);
    if (favSongs) {
      res.status(200).send(favSongs);
    } else {
      res.status(404).json({
        message: "This userID doesn't exist",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "This userID doesn't exist",
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const favsong = await FavSongs.create(req.body);
    if (favsong) {
      FavSongs.find()
        .then((favSong) => {
          res.status(200).json({
            favSong,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: "Something went wrong",
          });
        });
    } else {
      res.status(404).send("try again");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let song = await FavSongs.findByIdAndDelete(id);
    if (song) {
      FavSongs.find()
        .then((favSong) => {
          res.status(200).json({
            favSong,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: "Something went wrong",
          });
        });
    } else {
      res.status(404).send("Song Not Found");
    }
  } catch (error) {
    res.status(404).json({
      error: "Song Not Found",
    });
  }
});

module.exports = app;
