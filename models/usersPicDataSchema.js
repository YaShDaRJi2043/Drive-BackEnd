const mongoose = require("mongoose");

const usersPicDataSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },

  photos: [
    {
      pics: {
        type: String,
      },
      fileName: {
        type: String,
      },
      fileType: {
        type: String,
      },
      fileSize: {
        type: String,
      },
      fileTime: {
        type: String,
      },
      isStar: {
        type: Boolean,
      },
    },
  ],

  totalSize: {
    type: String,
  },
});

const mainData = new mongoose.model("storages", usersPicDataSchema);
module.exports = mainData;
