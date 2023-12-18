const googleUsersData = require("../../models/googleSchema");
const userDatas = require("../../models/userSchema");

exports.googleUserRegister = async (req, res) => {
  const { displayName, email } = req.body;
  try {
    const preUser = await userDatas.findOne({ email: email });
    const preUser2 = await userDatas.findOne({ Email: email });

    if (preUser || preUser2) {
      res.status(404).json({ status: 404, message: "yes" });
    } else {
      const googleUsersDetails = new googleUsersData({
        displayName,
        email,
      });

      const finalData = await googleUsersDetails.save();
      res.status(200).json({ status: 200, finalData });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Data Can't Added" });
  }
};
