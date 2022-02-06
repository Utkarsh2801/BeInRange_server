const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let geofenceSchema = new Schema(
  {
    coords: {
      type: [Number],
      required: true,
    },
    radius : {
        type : Number,
        required : true
    },
    user : {
        type : String,
        required : true
    },
    geofenceId : {
        type : String,
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
  },
  {
    timestamps: true,
  },
);



module.exports = new mongoose.model("geofence", geofenceSchema);