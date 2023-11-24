const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("db connected"))
  .catch((error) => {
    console.log("Error" + error.message);
  });
