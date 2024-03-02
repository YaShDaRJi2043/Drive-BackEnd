const usersData = require("../../models/userSchema");

// user Register
exports.userRegister = async (req, res) => {
  const { FirstName, LastName, email, Password } = req.body;
  try {
    if (!FirstName || !LastName || !email || !Password) {
      res.status(404).json({ status: 404, message: "Fill All The Details" });
    }

    const preUser = await usersData.findOne({ email: email });

    if (preUser) {
      res.status(404).json({ status: 404, message: "Email Already Taken" });
    } else {
      const displayName = `${FirstName} ${LastName}`;

      const usersDetails = new usersData({
        displayName,
        email,
        Password,
      });

      const finalData = await usersDetails.save();
      res.status(200).json({ status: 200, finalData });
      console.log(finalData);
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Enter Valid Details" });
  }
};
