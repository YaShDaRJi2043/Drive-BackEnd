const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },

  Password: {
    type: String,
    required: true,
  },

  RegisterWith: {
    type: String,
    default: "Register with Form",
  },
});

// Password hasing(bcrypt password)
userSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcryptjs.hash(this.Password, 12);
  }
  next();
});

const usersData = new mongoose.model("userdatas", userSchema);
module.exports = usersData;
