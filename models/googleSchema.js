const mongoose = require("mongoose");

const googleSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },

  email: {
    type: String,
  },

  Password: {
    type: String,
    default: " ",
  },

  RegisterWith: {
    type: String,
    default: "Register with Google",
  },
});

const googleUsersData = new mongoose.model(
  "googleuserdatas",
  googleSchema,
  "userdatas"
);
module.exports = googleUsersData;
