const googleUsersData = require("../../models/googleSchema");

exports.googleUserRegister = async (req, res) => {
  const { displayName, email } = req.body;
  try {
    const googleUsersDetails = new googleUsersData({
      displayName,
      email,
    });

    const finalData = await googleUsersDetails.save();
    res.status(200).json({ status: 200, finalData });
    console.log(finalData);
  } catch (error) {
    res.status(404).json({ status: 404, message: "Data Can't Added" });
  }
};
