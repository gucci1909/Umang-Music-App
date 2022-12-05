const mongoose = require("mongoose");

favSongSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    songID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs",
        required: true
    }]
},{
    versionKey:false,
    timestamps:true
});
module.exports = mongoose.model("favSongs", favSongSchema);