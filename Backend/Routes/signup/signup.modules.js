const mongoose = require("mongoose");

signupSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    password: { required: true, type: String, minlength: 6 },
    emailID: {
      required: true,
      type: String,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    phone: { required: true, type: Number },
    userType: { required: true, type: String, enum: ["admin", "user"] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("users", signupSchema);
