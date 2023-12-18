const express = require("express");
const userpic = express.Router();
const {
  usersPicsDataPost,
  usersPicsDataGet,
} = require("../controllers/usersPicsData/usersPicDataController");
const authenticate = require("../middlewere/authenticate");

userpic.post("/usersPicData", usersPicsDataPost);

userpic.get("/showUsersData", usersPicsDataGet);

module.exports = userpic;
