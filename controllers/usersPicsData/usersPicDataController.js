const mainData = require("../../models/usersPicDataSchema");

// store user data (Post)
exports.usersPicsDataPost = async (req, res) => {
  const { Email, pics, fileName, fileType, fileSize, fileTime } = req.body;
  try {
    if (
      !Email == "" &&
      !pics == "" &&
      !fileName == "" &&
      !fileType == "" &&
      !fileSize == "" &&
      !fileTime == ""
    ) {
      const verifyUser = await mainData.findOne({ Email });

      if (verifyUser) {
        if (pics !== "") {
          // Calculate the total size of existing photos
          let totalSize = 0;
          verifyUser.photos.forEach((photo) => {
            totalSize += parseFloat(photo.fileSize);
          });

          // If user exists, update the 'photos' array
          verifyUser.photos.push({
            pics,
            fileName,
            fileType,
            fileSize,
            fileTime,
            isStar: false,
          });

          // Update totalSize with the size of the new photo
          totalSize += parseFloat(fileSize);
          const fixed = totalSize.toFixed(2);

          // Update totalSize in the database
          verifyUser.totalSize = fixed.toString();

          const finalPicData = await verifyUser.save();
          res.status(200).json({ status: 200, finalPicData, message: "Done" });
        } else {
          res
            .status(400)
            .json({ status: 400, message: "Please select an image" });
        }
      } else {
        // If user doesn't exist, create a new entry
        const usersPicDetails = new mainData({
          Email,
          photos: [
            { pics, fileName, fileType, fileSize, fileTime, isStar: false },
          ],
          totalSize: fileSize,
        });

        const finalPicData = await usersPicDetails.save();
        res.status(200).json({ status: 200, finalPicData, message: "Done" });
      }
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: 404, message: "Users Data could not be stored" });
  }
};

// Get api of user photos
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
      res.status(404).json({ status: 404, message: "Data not available" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "users Data can not show" });
  }
};

// update value of isStar in mainData collection
exports.changeIsStarredValue = async (req, res) => {
  const email = req.query.email;
  const id = req.query.id;

  try {
    const userData = await mainData.findOne({ Email: email });

    if (userData) {
      const pics = userData.photos;
      const pic = pics.find((p) => p._id.toString() === id);

      if (pic) {
        // Toggle the value of isStar
        pic.isStar = !pic.isStar;

        // Save the updated userData
        await userData.save();

        res.status(200).json({
          status: 200,
          message: "isStar value toggled successfully",
          updatedUserData: userData,
        });
      } else {
        res.status(404).json({ status: 404, message: "Photo not found" });
      }
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Internal Server Error" });
  }
};

// get Starred Data(pic)
exports.usersStaredPicsDataGet = async (req, res) => {
  const Email = req.query.email;
  try {
    // google id
    const userData = await mainData.findOne({ Email: Email });

    // form id
    const userData2 = await mainData.findOne({ email: Email });

    if (userData) {
      const filteredPhotos = userData.photos.filter((photo) => photo.isStar);

      if (filteredPhotos.length > 0) {
        res.status(200).json(filteredPhotos);
      } else {
        res.status(404).json({ status: 404, message: "No photos found" });
      }
    } else if (userData2) {
      const filteredPhotos = userData2.photos.filter((photo) => photo.isStar);

      if (filteredPhotos.length > 0) {
        res.status(200).json(filteredPhotos);
      } else {
        res.status(404).json({ status: 404, message: "No photos found" });
      }
    } else {
      res.status(404).json({ status: 404, message: "User data not found" });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Internal Server Error" });
  }
};

// Recent Uploaded Pic
exports.usersResentPicsDataGet = async (req, res) => {
  const Email = req.query.email;
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Fetch data with photos from the last 7 days
    // google id
    const verifyUser = await mainData.find({
      Email: Email,
      photos: {
        $elemMatch: { fileTime: { $gte: sevenDaysAgo.toISOString() } },
      },
    });

    // form id
    const verifyUser2 = await mainData.find({
      email: Email,
      photos: {
        $elemMatch: { fileTime: { $gte: sevenDaysAgo.toISOString() } },
      },
    });

    if (verifyUser && verifyUser.length > 0) {
      res.status(200).json(verifyUser);
    } else if (verifyUser2 && verifyUser2.length > 0) {
      res.status(200).json(verifyUser2);
    } else {
      res.status(404).json({
        status: 404,
        message: "Data not available in the last 7 days",
      });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: 404, message: "Users data can not be shown" });
  }
};

// Delete Photo
exports.deletePhotoFromMainPage = async (req, res) => {
  const { email, id } = req.query;
  try {
    // Find the user by email
    const user = await mainData.findOne({ Email: email });
    const user2 = await mainData.findOne({ email: email });
    if (user) {
      // Find the photo to be deleted
      const photoToDelete = user.photos.find(
        (photo) => photo._id.toString() === id
      );
      if (!photoToDelete) {
        return res.status(404).json({ message: "Photo not found" });
      }

      // Update the total size by subtracting the size of the deleted photo
      user.totalSize = (
        parseFloat(user.totalSize) - parseFloat(photoToDelete.fileSize)
      ).toFixed(2);

      // Remove the photo from the photos array
      user.photos = user.photos.filter((photo) => photo._id.toString() !== id);

      // Save the updated user object
      await user.save();

      res.status(200).json({ message: "Photo deleted successfully" });
    } else if (user2) {
      // Find the photo to be deleted
      const photoToDelete = user2.photos.find(
        (photo) => photo._id.toString() === id
      );
      if (!photoToDelete) {
        return res.status(404).json({ message: "Photo not found" });
      }

      // Update the total size by subtracting the size of the deleted photo
      user2.totalSize = (
        parseFloat(user2.totalSize) - parseFloat(photoToDelete.fileSize)
      ).toFixed(2);

      // Remove the photo from the photos array
      user2.photos = user2.photos.filter(
        (photo) => photo._id.toString() !== id
      );

      // Save the updated user object
      await user2.save();

      res.status(200).json({ message: "Photo deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
