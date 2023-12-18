const secratekey = process.env.SECRETKEY;
const jwt = require("jsonwebtoken");
const userDatas = require("../models/userSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const verifytoken = jwt.verify(token, secratekey);

    const rootUser = await userDatas.findOne({ _id: verifytoken._id });

    const rootUserEmail = await userDatas.findOne({ Email: verifytoken.Email });

    if (!rootUser) {
      throw new Error("user not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    req.userEmail = rootUserEmail.Email;

    next();
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = authenticate;
