const express = require("express");
const usersRouter = express.Router();
const { userRegister } = require("../controllers/users/userRegisterController");
const { userLogin } = require("../controllers/users/userLoginController");
const {
  googleUserRegister,
} = require("../controllers/users/googleUserRegisterController");

//user Register(signup) with form
usersRouter.post("/userRegister", userRegister);

//user Register(signup) with google
usersRouter.post("/googleUserRegister", googleUserRegister);

// user Login
usersRouter.post("/userLogin", userLogin);

module.exports = usersRouter;
