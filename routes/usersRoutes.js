const express = require("express");
const usersRouter = express.Router();
const { userRegister } = require("../controllers/users/userRegisterController");
const { userLogin } = require("../controllers/users/userLoginController");
const {
  googleUserRegister,
} = require("../controllers/users/googleUserRegisterController");
const { userDetail } = require("../controllers/users/getUserDetails");

//user Register(signup) with form
usersRouter.post("/userRegister", userRegister);

// user Register(signup) with google
usersRouter.post("/googleUserRegister", googleUserRegister);

// user Login
usersRouter.post("/userLogin", userLogin);

//user details
usersRouter.get("/userDetails", userDetail);

module.exports = usersRouter;
