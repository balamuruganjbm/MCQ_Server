const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const { hashGenerate } = require("../helpers/hashing");
const { hashValidator } = require("../helpers/hashing");
const { tokenGenerator, tokenValidator } = require("../helpers/token");
authRoutes.post("/signup", async (req, res) => {
  try {
    const hashPassword = await hashGenerate(req.body.password);
    const user = new User({
      username: req.body.name,
      email: req.body.email,
      password: hashPassword
    });
    const savedUser = await user.save();
    res.status(200).json({ message: "Success", user: savedUser });
  } catch (err) {
    res.status(200).json({ message: "Failure" });
  }
});

authRoutes.post("/signin", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      res.status(200).json({ message: "Failure", error: "Email is Incorrect" });
    } else {
      const checkUser = await hashValidator(
        req.body.password,
        existingUser.password
      );
      if (!checkUser) {
        res
          .status(200)
          .json({ message: "Failure", error: "Password is Incorrect" });
      } else {
        const token = await tokenGenerator(existingUser.email);

        res.status(200).json({
          message: "Success",
          jwtToken: token,
          score: existingUser.score,
          id: existingUser._id
        });
      }
    }
  } catch (error) {
    res.status(200).json({ message: "Failure" });
  }
});
authRoutes.get("/isLoggedIn", (req, res) => {
  const jwt = req.header("Authorization");

  const verify = tokenValidator(jwt);
  verify
    .then(result => {
      if (result) res.status(200).json({ message: "Success" });
      else res.status(200).json({ message: "Failure" });
    })
    .catch(e => {
      res.status(200).json({ message: "Failure" });
    });
});
authRoutes.post("/:id", function(req, res) {
  User.findByIdAndUpdate(req.params.id, { score: req.body.score }, err => {
    if (err) res.status(200).json({ message: "Failure" });
    res.status(200).json({ message: "Success" });
  });
});

module.exports = authRoutes;
