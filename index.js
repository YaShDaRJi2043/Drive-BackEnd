require("dotenv").config();

const express = require("express");
const app = express();

require("./db/conn");
const usersRoutes = require("./routes/usersRoutes");
const usersPicDataRoutes = require("./routes/usersPicDataRoutes");

const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(usersRoutes);
app.use(usersPicDataRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
