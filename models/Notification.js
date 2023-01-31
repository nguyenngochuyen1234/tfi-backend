const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["group", "message", "task", "post", "comment"],
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
    description: {
      type: String,
      required: false,
    },
    deadline: {
      type: Date,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Date,
      required: true,
      default: Date.now
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);