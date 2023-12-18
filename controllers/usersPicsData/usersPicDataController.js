const mainData = require("../../models/usersPicDataSchema");
const userDatas = require("../../models/userSchema");

// store user data (Post)
exports.usersPicsDataPost = async (req, res) => {
  const { Email, pics } = req.body;
  try {
    const verifyUser = await userDatas.findOne({ Email: Email });
    const verifyUser2 = await userDatas.findOne({ email: Email });

    if (verifyUser || verifyUser2) {
      const userData = await mainData.findOne({ Email: Email });

      if (pics !== "") {
        if (userData) {
          // If user exists, update the 'photos' array
          userData.photos.push({ pics });

          const finalPicData = await userData.save();
          res.status(200).json({ status: 200, finalPicData, message: "Done" });
        } else {
          // If user doesn't exist, create a new entry
          const usersPicDetails = new mainData({
            Email,
            photos: [{ pics }],
          });

          const finalPicData = await usersPicDetails.save();
          res.status(200).json({ status: 200, finalPicData, message: "Done" });
        }
      } else {
        res.status(400).json({ status: 400, message: "pls select img" });
      }
    } else {
      res.status(400).json({ status: 400, message: "user not found" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "users Data can not store" });
  }
};

exports.usersPicsDataGet = async (req, res) => {
  const Email = req.query.email;
  try {
    // google id
    const verifyUser = await mainData.find({ Email: Email });

    // form id
    const verifyUser2 = await mainData.find({ email: Email });

    if (verifyUser) {
      res.status(200).json(verifyUser);
    } else if (verifyUser2) {
      res.status(200).json(verifyUser2);
    } else {
      res.status(404).json({ status: 404, message: "Data not availabe" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "users Data can not show" });
  }
};
