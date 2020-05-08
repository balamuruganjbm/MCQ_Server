const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB connected...!");
  }
);
app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
mongoose.set("useFindAndModify", false);

//Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Working" });
});
app.use("/api/user/", authRoutes);

app.listen(5100, () => {
  console.log("Server running...!");
});
