const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      enum: ["group", "message"],
      default: "group",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    seen:{
      type:Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);