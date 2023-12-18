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
    },
  ],
});

const mainData = new mongoose.model("storages", usersPicDataSchema);
module.exports = mainData;
