const usersData = require("../../models/userSchema");

exports.userDetail = async (req, res) => {
  const email = req.query.email;
  try {
    const data = await usersData.find({ email: email });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ status: 404, message: "don't get" });
  }
};
