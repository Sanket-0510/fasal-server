const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const { User } = require("./models/User");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const searchRoutes = require("./routes/movies");
app.use("/movies", searchRoutes);

const listRoutes = require("./routes/list");
app.use("/list", listRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Api Server Running" });
});

app.listen(PORT, async () => {
  console.log("server started: " + PORT);
  await connectDB();
});
