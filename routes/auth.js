const express = require("express");
const router = express.Router();
const signup = require("../controllers/auth")
// import signup from "../controllers/auth";

router.post("/api/signup");

module.exports = router;