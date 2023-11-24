const usersData = require("../../models/userSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRETKEY = process.env.SECRETKEY;

// user login
exports.userLogin = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    if (!Email || !Password) {
      res.status(404).json({ status: 404, message: "Fill All The Details" });
    }

    const checkUserEmail = await usersData.findOne({ Email: Email });
    // console.log(checkUserEmail);

    if (checkUserEmail.RegisterWith == "Register with Form") {
      const checkUserPassword = await bcryptjs.compare(
        Password,
        checkUserEmail.Password
      );

      if (checkUserPassword) {
        // Tokan Genrate
        const tokan = jwt.sign({ _id: this._id }, SECRETKEY, {
          expiresIn: "30d",
        });

        res
          .status(200)
          .json({ status: 200, checkUserPassword, tokan, checkUserEmail });
      } else {
        res.status(404).json({ status: 404, message: "Enter Valid Password" });
      }
    } else {
      res.status(404).json({ status: 404, message: "Email Not Found!!" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Enter Valid Details" });
  }
};
