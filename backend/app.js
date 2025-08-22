const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Impor errorHandler dengan benar
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Register semua route sesuai ERD
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/genres", require("./routes/genre.routes"));
app.use("/api/series", require("./routes/series.routes"));
app.use("/api/episodes", require("./routes/episode.routes"));
app.use("/api/movies", require("./routes/movie.routes"));
// Register route untuk upload
app.use("/api/upload", require("./routes/upload.routes"));

// Register error handler
app.use(errorHandler);

module.exports = app;
