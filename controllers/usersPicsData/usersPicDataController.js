const { json } = require("express");
const mainData = require("../../models/usersPicDataSchema");

// store user data (Post)
exports.usersPicsDataPost = async (req, res) => {
  const { email, pics, fileName, fileType, fileSize, fileTime } = req.body;
  try {
    if (
      email !== "" &&
      pics !== "" &&
      fileName !== "" &&
      fileType !== "" &&
      fileSize !== "" &&
      fileTime !== ""
    ) {
      const verifyUser = await mainData.findOne({ email: email });

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

          if (fixed > 10) {
            res
              .status(400)
              .json({ status: 400, message: "Not Enough Space!!" });
          } else {
            // Update totalSize in the database
            verifyUser.totalSize = fixed.toString();

            const finalPicData = await verifyUser.save();
            res
              .status(200)
              .json({ status: 200, finalPicData, message: "Done" });
          }
        } else {
          res
            .status(400)
            .json({ status: 400, message: "Please select an image" });
        }
      } else {
        // If user doesn't exist, create a new entry
        const usersPicDetails = new mainData({
          email,
          photos: [
            { pics, fileName, fileType, fileSize, fileTime, isStar: false },
          ],
          totalSize: fileSize,
        });

        const finalPicData = await usersPicDetails.save();
        res.status(200).json({ status: 200, finalPicData, message: "Done" });
      }
    } else {
      res.status(404).json({ status: 404, message: "Fill up all the values" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: 404, message: "Users Data could not be stored" });
  }
};

// Get api of user photos
exports.usersPicsDataGet = async (req, res) => {
  const email = req.query.email;
  try {
    // Find user by email
    const userData = await mainData.find({ email: email });

    res.status(200).json(userData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ status: 500, message: "Failed to fetch user data" });
  }
};

// update value of isStar in mainData collection
exports.changeIsStarredValue = async (req, res) => {
  const email = req.query.email;
  const id = req.query.id;

  try {
    const userData = await mainData.findOne({ email: email });

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
          message: "Image Star value Change successfully",
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
  const email = req.query.email;
  try {
    // Find user by email
    const userData = await mainData.findOne({ email: email });

    if (userData) {
      // Filter photos marked as starred
      const filteredPhotos = userData.photos.filter((photo) => photo.isStar);

      res.status(200).json(filteredPhotos);
    } else {
      // User not found
      res.status(404).json({ status: 404, message: "User data not found" });
    }
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Recent Uploaded Pic
exports.usersResentPicsDataGet = async (req, res) => {
  const email = req.query.email;
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Fetch data with photos from the last 7 days
    const userData = await mainData.find({
      email: email,
      photos: {
        $elemMatch: { fileTime: { $gte: sevenDaysAgo.toISOString() } },
      },
    });

    res.status(200).json(userData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Delete Photo
exports.deletePhotoFromMainPage = async (req, res) => {
  const { email, id } = req.query;
  try {
    // Find the user by email
    const user = await mainData.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
