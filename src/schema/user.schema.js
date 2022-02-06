const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fcmToken : {
        type : String,
        required : true
    },
  },
  {
    timestamps: true,
  },
);



module.exports = new mongoose.model("user", userSchema);