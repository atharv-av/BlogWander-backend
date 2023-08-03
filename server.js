const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const blogRoutes = require("./routes/blog");

//  App
const app = express();

// Database
mongoose.connect(process.env.DATABASE_CLOUD, {}).then(() => {console.log("DB connected")});

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
if(process.env.NODE_ENV == "development"){
    app.use(cors( {origin: `${process.env.CLIENT_URL}` }));
}
app.use(blogRoutes);

// Routes
app.get("/api", (req, res) => {
    res.json({ time: Date().toString() });
});

//  Port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});
