const usersData = require("../../models/userSchema");

// user Register
exports.userRegister = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;
  try {
    if (!FirstName || !LastName || !Email || !Password) {
      res.status(404).json({ status: 404, message: "Fill All The Details" });
    }

    const preUser = await usersData.findOne({ Email: Email });

    if (preUser) {
      res.status(404).json({ status: 404, message: "Email Already Taken" });
    }

    const displayName = `${FirstName} ${LastName}`;

    const usersDetails = new usersData({
      displayName,
      Email,
      Password,
    });

    const finalData = await usersDetails.save();
    res.status(200).json({ status: 200, finalData });
    console.log(finalData);
  } catch (error) {
    res.status(404).json({ status: 404, message: "Enter Valid Details" });
  }
};
