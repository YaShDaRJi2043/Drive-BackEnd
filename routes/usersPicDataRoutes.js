const express = require("express");
const userpic = express.Router();
const {
  usersPicsDataPost,
  usersPicsDataGet,
  changeIsStarredValue,
  usersStaredPicsDataGet,
} = require("../controllers/usersPicsData/usersPicDataController");

// insert pic
userpic.post("/usersPicData", usersPicsDataPost);

// display pic
userpic.get("/showUsersData", usersPicsDataGet);

// STARRED

// display star img
userpic.get("/displayStarredImg", usersStaredPicsDataGet);

// update value of isStar in mainData collection
userpic.put("/changeValueOfIsStar", changeIsStarredValue);

module.exports = userpic;
