const mongoose = require("mongoose");

songSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { required:true,type: String },
    artistNames: {required:true,type:String},
    imageURL: { required:true, type: String },
    releaseYearOfSong: { required:true, type: Number },
    roomNo : {required:true,type:Number},
    songURL: { type: String },
  }
);

module.exports = mongoose.model("songs",songSchema);