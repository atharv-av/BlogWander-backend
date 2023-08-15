const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const app = require("../server");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
      const { name, email, password } = req.body;
      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      let newUser = new User({ name, email, password, profile, username });

      newUser
        .save()
        .then((success) => {
          res.json({
            message: "Signup success! please signin",
          });
        })
        .catch((err) => {
          return res.status(400).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      // Check if the user exists or not
      if (!user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup.",
        });
      }
      // Authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }
      // Generate a token and send it to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1d" });
      const { _id, username, name, email, role } = user;
      return res.json({
        token,
        user: { _id, username, name, email, role },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  // audience: "http://myapi/protected",
  // issuer: "http://issuer",
  algorithms: ["HS256"],
});
